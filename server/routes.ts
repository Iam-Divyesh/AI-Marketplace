import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, productQuerySchema, aiQuerySchema } from "@shared/schema";
import { getProductRecommendations, generateChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json({ product, message: "Product created successfully" });
    } catch (error) {
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
      
      const recommendations = await getProductRecommendations(query, allProducts);
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
      const aiResponse = await generateChatResponse(
        query,
        allProducts,
        chatSession.messages || []
      );

      // Update chat history
      const updatedMessages = [...(chatSession.messages || []), query, aiResponse];
      await storage.updateChatSession(chatSession.id, updatedMessages);

      res.json({ 
        response: aiResponse, 
        sessionId: chatSession.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({ 
        error: "Chat request failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
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
