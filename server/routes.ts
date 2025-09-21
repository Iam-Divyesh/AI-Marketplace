import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, productQuerySchema, aiQuerySchema } from "@shared/schema";
import { getProductRecommendations, generateChatResponse } from "./services/openai";
import { GeminiService } from "./services/gemini";
import { FallbackAIService } from "./services/fallback-ai";
import authRoutes from "./routes/auth";
import { authenticateToken, requireArtisan, requireCustomer } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize services
  const geminiService = new GeminiService();
  
  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const filters = productQuerySchema.parse({
        category: req.query.category as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        location: req.query.location as string | undefined,
        search: req.query.search as string | undefined,
      });

      const products = await storage.getProducts(filters);
      res.json({ products, total: products.length });
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid query parameters",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ product });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      // Parse and validate the product data
      const productData = insertProductSchema.parse(req.body);
      
      // Ensure required fields are present
      if (!productData.artisanId) {
        return res.status(400).json({ 
          error: "Artisan ID is required",
          message: "Please ensure you are logged in as an artisan"
        });
      }

      const product = await storage.createProduct(productData);
      res.status(201).json({ product, message: "Product created successfully" });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ 
        error: "Invalid product data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ product, message: "Product updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid update data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // AI recommendation routes
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { query } = aiQuerySchema.parse(req.body);
      const allProducts = await storage.getProducts();
      
      let recommendations;
      try {
        recommendations = await getProductRecommendations(query, allProducts);
      } catch (aiError) {
        console.log('Using fallback AI for recommendations');
        recommendations = FallbackAIService.getProductRecommendations(query, allProducts);
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid AI query",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { query, sessionId } = aiQuerySchema.parse(req.body);
      
      let chatSession;
      if (sessionId) {
        chatSession = await storage.getChatSession(sessionId);
      }
      
      if (!chatSession) {
        chatSession = await storage.createChatSession();
      }

      const allProducts = await storage.getProducts();
      
      let aiResponse;
      try {
        // Use Gemini for chat responses
        aiResponse = await geminiService.generateChatResponse(query, {
          userType: 'customer',
          previousMessages: Array.isArray(chatSession.messages) ? chatSession.messages : [],
          availableProducts: allProducts
        });
      } catch (aiError) {
        console.log('Using fallback AI for chat');
        aiResponse = FallbackAIService.generateChatResponse(query, allProducts);
      }

      // Update chat history
      const updatedMessages = [...(Array.isArray(chatSession.messages) ? chatSession.messages : []), query, aiResponse];
      await storage.updateChatSession(chatSession.id, updatedMessages);

      res.json({ 
        response: aiResponse, 
        sessionId: chatSession.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(400).json({ 
        error: "Chat request failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Market analysis routes
  app.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { userType, businessType, location, products, userId } = req.body;
      
      // Get user's products for analysis
      const userProducts = userId ? await storage.getProductsByArtisan(userId) : await storage.getProducts();
      
      // Use fallback AI service for market analysis
      const analysis = FallbackAIService.generateMarketAnalysis(userType, businessType, location);

      res.json(analysis);
    } catch (error) {
      console.error('Market analysis error:', error);
      res.status(500).json({ 
        error: "Market analysis failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Custom analysis route
  app.post("/api/ai/custom-analysis", async (req, res) => {
    try {
      const { query, context } = req.body;
      
      if (!query || !query.trim()) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Get products for context
      const allProducts = await storage.getProducts();
      
      // Use fallback AI service for custom analysis
      const response = FallbackAIService.generateChatResponse(query, allProducts);

      res.json({ 
        analysis: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom analysis error:', error);
      res.status(500).json({ 
        error: "Custom analysis failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      // For now, return empty array - orders will be implemented later
      res.json({ orders: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Artisan stats routes
  app.get("/api/artisan/stats", async (req, res) => {
    try {
      const artisanId = req.query.artisan as string;
      if (!artisanId) {
        return res.status(400).json({ error: "Artisan ID is required" });
      }

      const products = await storage.getProductsByArtisan(artisanId);
      const totalProducts = products.length;
      const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
      const totalRevenue = products.reduce((sum, p) => sum + (p.sales || 0) * parseFloat(p.price), 0);
      const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
      const avgRating = products.length > 0 
        ? products.reduce((sum, p) => sum + parseFloat(p.rating || '0'), 0) / products.length 
        : 0;

      const stats = {
        totalProducts,
        totalSales,
        totalRevenue,
        totalViews,
        avgRating,
        pendingOrders: 0, // Will be implemented with orders
        thisMonthRevenue: totalRevenue, // Simplified for now
        thisMonthSales: totalSales
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artisan stats" });
    }
  });

  // Artisan routes
  app.get("/api/artisan/:id/products", async (req, res) => {
    try {
      const products = await storage.getProductsByArtisan(req.params.id);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artisan products" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
