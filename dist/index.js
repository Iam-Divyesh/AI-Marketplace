// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  products;
  chatSessions;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.chatSessions = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      artisanName: insertUser.artisanName || null,
      location: insertUser.location || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getProducts(filters) {
    let products2 = Array.from(this.products.values()).filter((p) => p.status === "active");
    if (filters) {
      if (filters.category) {
        products2 = products2.filter(
          (p) => p.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      if (filters.subcategory) {
        products2 = products2.filter(
          (p) => p.subcategory?.toLowerCase().includes(filters.subcategory.toLowerCase())
        );
      }
      if (filters.minPrice) {
        products2 = products2.filter((p) => parseFloat(p.price) >= filters.minPrice);
      }
      if (filters.maxPrice) {
        products2 = products2.filter((p) => parseFloat(p.price) <= filters.maxPrice);
      }
      if (filters.location) {
        products2 = products2.filter(
          (p) => p.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.artisanId) {
        products2 = products2.filter((p) => p.artisanId === filters.artisanId);
      }
      if (filters.artisan) {
        products2 = products2.filter(
          (p) => p.artisanName.toLowerCase().includes(filters.artisan.toLowerCase())
        );
      }
      if (filters.isFeatured !== void 0) {
        products2 = products2.filter((p) => p.isFeatured === filters.isFeatured);
      }
      if (filters.isActive !== void 0) {
        products2 = products2.filter((p) => p.isActive === filters.isActive);
      }
      if (filters.materials && filters.materials.length > 0) {
        products2 = products2.filter(
          (p) => p.materials?.some(
            (material) => filters.materials.some(
              (filterMaterial) => material.toLowerCase().includes(filterMaterial.toLowerCase())
            )
          )
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        products2 = products2.filter(
          (p) => p.tags?.some(
            (tag) => filters.tags.some(
              (filterTag) => tag.toLowerCase().includes(filterTag.toLowerCase())
            )
          )
        );
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products2 = products2.filter(
          (p) => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm) || p.artisanName.toLowerCase().includes(searchTerm)
        );
      }
    }
    if (filters?.sortBy) {
      const sortBy = filters.sortBy;
      const sortOrder = filters.sortOrder || "desc";
      products2.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "price":
            aValue = parseFloat(a.price);
            bValue = parseFloat(b.price);
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "views":
            aValue = a.views || 0;
            bValue = b.views || 0;
            break;
          case "likes":
            aValue = a.likes || 0;
            bValue = b.likes || 0;
            break;
          case "sales":
            aValue = a.sales || 0;
            bValue = b.sales || 0;
            break;
          case "rating":
            aValue = parseFloat(a.rating || "0");
            bValue = parseFloat(b.rating || "0");
            break;
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    } else {
      products2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return products2;
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(insertProduct) {
    const id = randomUUID();
    const product = {
      ...insertProduct,
      id,
      artisanId: insertProduct.artisanId || null,
      artisanName: insertProduct.artisanName || "Unknown Artisan",
      location: insertProduct.location || "",
      status: "active",
      isActive: insertProduct.isActive ?? true,
      isFeatured: insertProduct.isFeatured ?? false,
      views: 0,
      likes: 0,
      sales: 0,
      rating: "0.00",
      materialCost: insertProduct.materialCost || "0.00",
      laborCost: insertProduct.laborCost || "0.00",
      overheadCost: insertProduct.overheadCost || "0.00",
      totalCost: insertProduct.totalCost || "0.00",
      profitMargin: insertProduct.profitMargin || "0.00",
      stock: insertProduct.stock || 0,
      weight: insertProduct.weight || null,
      dimensions: insertProduct.dimensions || null,
      materials: insertProduct.materials || [],
      tags: insertProduct.tags || [],
      processingTime: insertProduct.processingTime || null,
      careInstructions: insertProduct.careInstructions || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, updates) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  async getProductsByArtisan(artisanId) {
    return Array.from(this.products.values()).filter(
      (p) => p.artisanId === artisanId && p.status === "active"
    );
  }
  async createChatSession(userId) {
    const id = randomUUID();
    const session = {
      id,
      userId: userId || null,
      messages: [],
      createdAt: /* @__PURE__ */ new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }
  async getChatSession(id) {
    return this.chatSessions.get(id);
  }
  async updateChatSession(id, messages) {
    const session = this.chatSessions.get(id);
    if (!session) return void 0;
    const updatedSession = { ...session, messages };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: json("address"),
  userType: text("user_type").notNull().default("customer"),
  // 'artisan' or 'customer'
  artisanName: text("artisan_name"),
  businessName: text("business_name"),
  location: text("location"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  images: json("images").notNull(),
  // Array of image URLs
  model3d: text("model_3d"),
  // 3D model file path
  artisanId: varchar("artisan_id").references(() => users.id).notNull(),
  artisanName: text("artisan_name").notNull(),
  location: text("location").notNull(),
  status: text("status").default("active"),
  // 'active', 'inactive', 'sold'
  stock: integer("stock").default(0),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: json("dimensions"),
  // {length, width, height}
  materials: text("materials").array(),
  tags: text("tags").array(),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  sales: integer("sales").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(0),
  // Cost tracking fields
  materialCost: decimal("material_cost", { precision: 10, scale: 2 }).default(0),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }).default(0),
  overheadCost: decimal("overhead_cost", { precision: 10, scale: 2 }).default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).default(0),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }).default(0),
  // Additional fields
  processingTime: text("processing_time"),
  careInstructions: text("care_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  artisanId: varchar("artisan_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"),
  // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  // 'pending', 'paid', 'failed', 'refunded'
  paymentId: text("payment_id"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var cart = pgTable("cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});
var analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  // 'product_view', 'sale', 'revenue', etc.
  data: json("data").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  artisanId: varchar("artisan_id").references(() => users.id),
  messages: json("messages").notNull().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketAnalysis = pgTable("market_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  artisanId: varchar("artisan_id").references(() => users.id),
  analysisType: text("analysis_type").notNull(),
  // 'local_market', 'global_market', 'pricing'
  data: json("data").notNull(),
  insights: text("insights"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  userType: z.enum(["artisan", "customer"]),
  artisanName: z.string().optional(),
  businessName: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional()
});
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
var forgotPasswordSchema = z.object({
  email: z.string().email()
});
var resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6)
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  views: true,
  likes: true
});
var productQuerySchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  artisanId: z.string().optional(),
  artisan: z.string().optional(),
  // For artisan filtering
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["price", "createdAt", "views", "likes", "sales", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  paymentStatus: true
});
var orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1)
});
var createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }),
  paymentMethod: z.string(),
  notes: z.string().optional()
});
var addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1)
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});
var aiQuerySchema = z.object({
  query: z.string().min(1),
  sessionId: z.string().optional(),
  context: z.string().optional()
});
var marketAnalysisSchema = z.object({
  productId: z.string().optional(),
  artisanId: z.string().optional(),
  analysisType: z.enum(["local_market", "global_market", "pricing", "competition"]),
  productData: z.object({
    name: z.string(),
    category: z.string(),
    price: z.number(),
    description: z.string(),
    materials: z.array(z.string()).optional()
  })
});

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function getProductRecommendations(query, allProducts) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for ArtisanAI, a marketplace for handcrafted items. 
          Your job is to recommend products based on user queries. 
          
          Available products: ${JSON.stringify(allProducts.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            artisanName: p.artisanName,
            location: p.location
          })))}
          
          Analyze the user query and return recommendations in this JSON format:
          {
            "recommendedProductIds": ["product_id1", "product_id2", ...],
            "explanation": "Brief explanation of why these products match the query",
            "confidence": 0.85
          }
          
          Consider:
          - Price ranges (\u20B9, $, \u20AC)
          - Categories (pottery, jewelry, textiles, woodwork, etc.)
          - Materials and craftsmanship
          - Location preferences
          - Style and aesthetic preferences
          
          Be helpful and conversational in your explanation.`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const recommendedProducts = allProducts.filter(
      (product) => result.recommendedProductIds?.includes(product.id)
    );
    return {
      products: recommendedProducts,
      explanation: result.explanation || "Here are some products that might interest you.",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    const searchTerms = query.toLowerCase();
    const fallbackProducts = allProducts.filter(
      (product) => product.name.toLowerCase().includes(searchTerms) || product.description.toLowerCase().includes(searchTerms) || product.category.toLowerCase().includes(searchTerms)
    ).slice(0, 6);
    return {
      products: fallbackProducts,
      explanation: "I found some products that might match your query. (AI assistant is temporarily unavailable)",
      confidence: 0.3
    };
  }
}

// server/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDju2iC27zjujf_yZSfdmizZMff1is4tb8");
var GeminiService = class {
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // Market analysis for products
  async analyzeMarket(data) {
    try {
      const prompt = `
        Analyze the market for this product and provide comprehensive insights:
        
        Product Details:
        - Name: ${data.productData.name}
        - Category: ${data.productData.category}
        - Price: $${data.productData.price}
        - Description: ${data.productData.description}
        - Materials: ${data.productData.materials?.join(", ") || "Not specified"}
        
        Analysis Type: ${data.analysisType}
        
        Please provide:
        1. Market insights including local vs global market trends
        2. Pricing recommendations based on similar products
        3. Target audience analysis
        4. Competitive landscape
        5. Growth opportunities
        6. Risk factors
        
        Format your response as JSON with the following structure:
        {
          "insights": "Detailed market insights...",
          "recommendations": "Actionable recommendations...",
          "marketData": {
            "localMarketSize": "estimated value",
            "globalMarketSize": "estimated value",
            "competitorCount": "number",
            "averagePrice": "price range",
            "growthRate": "percentage",
            "trends": ["trend1", "trend2", "trend3"]
          }
        }
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text2 = response.text();
      try {
        const parsed = JSON.parse(text2);
        return parsed;
      } catch (parseError) {
        return {
          insights: text2,
          recommendations: "Please review the analysis and consider market trends for pricing strategy.",
          marketData: {
            localMarketSize: "Unknown",
            globalMarketSize: "Unknown",
            competitorCount: "Unknown",
            averagePrice: "Unknown",
            growthRate: "Unknown",
            trends: ["Market analysis in progress"]
          }
        };
      }
    } catch (error) {
      console.error("Gemini market analysis error:", error);
      throw new Error("Failed to analyze market data");
    }
  }
  // Product recommendations based on user preferences
  async getProductRecommendations(userPreferences, availableProducts) {
    try {
      const productList = availableProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
        materials: p.materials
      }));
      const prompt = `
        Based on these user preferences: "${userPreferences}"
        
        And these available products: ${JSON.stringify(productList, null, 2)}
        
        Please recommend the top 5 most suitable products and explain why.
        
        Format your response as JSON:
        {
          "recommendations": [
            {
              "productId": "product_id",
              "reason": "Why this product matches the user's preferences",
              "confidence": 0.95
            }
          ],
          "explanation": "Overall explanation of the recommendations"
        }
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text2 = response.text();
      try {
        const parsed = JSON.parse(text2);
        return parsed;
      } catch (parseError) {
        return {
          recommendations: [],
          explanation: "Unable to generate recommendations at this time."
        };
      }
    } catch (error) {
      console.error("Gemini recommendation error:", error);
      throw new Error("Failed to generate product recommendations");
    }
  }
  // Generate product descriptions
  async generateProductDescription(productData) {
    try {
      const prompt = `
        Generate an engaging product description for an artisan marketplace:
        
        Product: ${productData.name}
        Category: ${productData.category}
        Materials: ${productData.materials.join(", ")}
        Artisan: ${productData.artisanName}
        Location: ${productData.location}
        
        Create a compelling description that:
        - Highlights the craftsmanship and quality
        - Mentions the materials and techniques
        - Appeals to potential customers
        - Is 2-3 paragraphs long
        - Uses engaging, professional language
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini description generation error:", error);
      return `A beautiful handcrafted ${productData.name} made by ${productData.artisanName} using traditional techniques and quality materials.`;
    }
  }
  // Chat assistance for customers and artisans
  async generateChatResponse(message, context) {
    try {
      const contextInfo = context.userType === "artisan" ? "You are helping an artisan with their business on the marketplace." : "You are helping a customer find products and answer questions.";
      const productContext = context.availableProducts?.length ? `Available products: ${context.availableProducts.map((p) => `${p.name} - \u20B9${p.price} - ${p.category} - by ${p.artisanName} - ${p.location}`).join(", ")}` : "";
      const prompt = `
        ${contextInfo}
        
        ${productContext}
        
        User message: "${message}"
        
        Previous conversation: ${context.previousMessages?.join("\n") || "None"}
        
        You are an AI shopping assistant for an artisan marketplace. Your main job is to help customers find products they'll love.
        
        When helping customers:
        1. Suggest specific products from the available list that match their needs
        2. Mention product names, prices in \u20B9, categories, and artisan names
        3. Ask follow-up questions to better understand their preferences
        4. Provide helpful information about artisan products and craftsmanship
        5. Be enthusiastic about handcrafted items and their unique qualities
        
        When helping artisans:
        1. Provide business advice for selling on the marketplace
        2. Suggest pricing strategies and marketing tips
        3. Help with product descriptions and SEO
        4. Offer insights about customer preferences and trends
        
        Keep responses conversational, helpful, and under 200 words. Always be encouraging about artisan craftsmanship.
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini chat error:", error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  }
  // Generate SEO-friendly content
  async generateSEOContent(product) {
    try {
      const prompt = `
        Generate SEO content for this product:
        
        Name: ${product.name}
        Category: ${product.category}
        Description: ${product.description}
        Materials: ${product.materials?.join(", ") || "Not specified"}
        Price: $${product.price}
        Location: ${product.location}
        
        Create:
        1. SEO-optimized title (max 60 characters)
        2. Meta description (max 160 characters)
        3. Relevant keywords array
        
        Format as JSON:
        {
          "title": "SEO title",
          "metaDescription": "Meta description",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
      `;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text2 = response.text();
      try {
        return JSON.parse(text2);
      } catch (parseError) {
        return {
          title: product.name,
          metaDescription: product.description.substring(0, 160),
          keywords: [product.category, product.materials?.[0] || "handcrafted"]
        };
      }
    } catch (error) {
      console.error("Gemini SEO generation error:", error);
      return {
        title: product.name,
        metaDescription: product.description.substring(0, 160),
        keywords: [product.category, "handcrafted", "artisan"]
      };
    }
  }
};

// server/services/fallback-ai.ts
var FallbackAIService = class {
  // Simple keyword-based product recommendations
  static getProductRecommendations(query, products2) {
    const searchTerms = query.toLowerCase().split(" ");
    const matchedProducts = products2.filter((product) => {
      const productText = `${product.name} ${product.description} ${product.category} ${product.materials?.join(" ") || ""}`.toLowerCase();
      return searchTerms.some((term) => productText.includes(term));
    });
    return {
      products: matchedProducts.slice(0, 5),
      explanation: `I found ${matchedProducts.length} products that match your search for "${query}". These are handcrafted items that might interest you!`,
      confidence: matchedProducts.length > 0 ? 0.7 : 0.3
    };
  }
  // Simple chat responses based on keywords
  static generateChatResponse(message, products2) {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! I'm your AI shopping assistant for artisan products. I can help you find unique handcrafted items like pottery, jewelry, textiles, and more. What are you looking for today?";
    }
    if (msg.includes("pottery") || msg.includes("ceramic") || msg.includes("clay")) {
      const potteryProducts = products2.filter((p) => p.category.toLowerCase().includes("pottery") || p.name.toLowerCase().includes("pottery"));
      if (potteryProducts.length > 0) {
        return `I found ${potteryProducts.length} beautiful pottery items! We have handcrafted ceramic pieces ranging from \u20B9${Math.min(...potteryProducts.map((p) => parseFloat(p.price)))} to \u20B9${Math.max(...potteryProducts.map((p) => parseFloat(p.price)))}. Each piece is unique and made by skilled artisans. Would you like to see specific items?`;
      }
      return "We have beautiful handcrafted pottery items! Our artisans create unique ceramic pieces using traditional techniques. Each item is one-of-a-kind and perfect for adding character to your home.";
    }
    if (msg.includes("jewelry") || msg.includes("jewellery") || msg.includes("necklace") || msg.includes("ring")) {
      const jewelryProducts = products2.filter((p) => p.category.toLowerCase().includes("jewelry") || p.name.toLowerCase().includes("jewelry"));
      if (jewelryProducts.length > 0) {
        return `I found ${jewelryProducts.length} stunning jewelry pieces! We have handcrafted accessories ranging from \u20B9${Math.min(...jewelryProducts.map((p) => parseFloat(p.price)))} to \u20B9${Math.max(...jewelryProducts.map((p) => parseFloat(p.price)))}. Each piece is carefully crafted by skilled artisans. Would you like to explore our collection?`;
      }
      return "We have exquisite handcrafted jewelry! Our artisans create beautiful accessories using traditional techniques and quality materials. Each piece tells a story of craftsmanship and artistry.";
    }
    if (msg.includes("textile") || msg.includes("fabric") || msg.includes("cloth") || msg.includes("weaving")) {
      const textileProducts = products2.filter((p) => p.category.toLowerCase().includes("textile") || p.name.toLowerCase().includes("textile"));
      if (textileProducts.length > 0) {
        return `I found ${textileProducts.length} beautiful textile items! We have handwoven fabrics and textile art ranging from \u20B9${Math.min(...textileProducts.map((p) => parseFloat(p.price)))} to \u20B9${Math.max(...textileProducts.map((p) => parseFloat(p.price)))}. Each piece showcases traditional weaving techniques. Would you like to see our collection?`;
      }
      return "We have beautiful handcrafted textiles! Our artisans create stunning fabrics using traditional weaving techniques. Each piece is unique and showcases the rich heritage of textile arts.";
    }
    if (msg.includes("wood") || msg.includes("woodwork") || msg.includes("carving")) {
      const woodProducts = products2.filter((p) => p.category.toLowerCase().includes("wood") || p.name.toLowerCase().includes("wood"));
      if (woodProducts.length > 0) {
        return `I found ${woodProducts.length} beautiful woodwork items! We have handcrafted wooden pieces ranging from \u20B9${Math.min(...woodProducts.map((p) => parseFloat(p.price)))} to \u20B9${Math.max(...woodProducts.map((p) => parseFloat(p.price)))}. Each piece is carefully carved and finished by skilled artisans. Would you like to explore our collection?`;
      }
      return "We have exquisite handcrafted woodwork! Our artisans create beautiful wooden items using traditional carving techniques. Each piece is unique and showcases the natural beauty of wood.";
    }
    if (msg.includes("price") || msg.includes("cost") || msg.includes("expensive") || msg.includes("cheap")) {
      const priceRange = products2.length > 0 ? {
        min: Math.min(...products2.map((p) => parseFloat(p.price))),
        max: Math.max(...products2.map((p) => parseFloat(p.price)))
      } : { min: 0, max: 0 };
      return `Our handcrafted items range from \u20B9${priceRange.min} to \u20B9${priceRange.max}. Each piece is priced based on the materials used, time invested, and the artisan's skill. Remember, you're not just buying a product - you're supporting traditional craftsmanship and getting a unique, one-of-a-kind item!`;
    }
    if (msg.includes("artisan") || msg.includes("maker") || msg.includes("craftsman")) {
      const uniqueArtisans = [...new Set(products2.map((p) => p.artisanName))];
      return `We work with ${uniqueArtisans.length} talented artisans from different regions! Each artisan brings their unique style and traditional techniques to their work. You can find items from artisans in ${[...new Set(products2.map((p) => p.location))].join(", ")}. Each purchase directly supports these skilled craftspeople and helps preserve traditional arts.`;
    }
    if (msg.includes("custom") || msg.includes("personalized") || msg.includes("bespoke")) {
      return "Many of our artisans offer custom and personalized items! You can request specific colors, sizes, or designs. Custom orders typically take 2-4 weeks to complete and are perfect for special occasions or unique gifts. Would you like me to help you find artisans who offer custom work?";
    }
    if (msg.includes("gift") || msg.includes("present") || msg.includes("occasion")) {
      return "Handcrafted items make perfect gifts! They're unique, meaningful, and support local artisans. We have items for every occasion - from everyday jewelry to special home decor. Each piece comes with the story of its maker, making it a truly special gift. What kind of gift are you looking for?";
    }
    if (msg.includes("quality") || msg.includes("durable") || msg.includes("lasting")) {
      return "All our products are made with high-quality materials and traditional techniques that have been refined over generations. Each artisan takes pride in their work and ensures every piece meets their standards. Handcrafted items often last longer than mass-produced alternatives because they're made with care and attention to detail.";
    }
    if (msg.includes("sustainable") || msg.includes("eco") || msg.includes("environment")) {
      return "Many of our artisans use sustainable and eco-friendly materials! Handcrafted items often have a smaller environmental footprint than mass-produced goods. Our artisans use natural materials, traditional techniques, and often source materials locally. You're supporting both traditional crafts and environmental sustainability!";
    }
    return "I'm here to help you discover amazing handcrafted items! We have beautiful pottery, jewelry, textiles, woodwork, and more from skilled artisans. Each piece is unique and tells a story of traditional craftsmanship. What type of item interests you most?";
  }
  // Market analysis fallback
  static generateMarketAnalysis(userType, businessType, location) {
    const businessTypeLower = (businessType || "handcrafted goods").toLowerCase();
    const locationLower = (location || "local").toLowerCase();
    let specificInsights = {
      trendingKeywords: ["sustainable", "handmade", "eco-friendly", "local artisan", "unique design", "custom", "traditional craft"],
      competitorGaps: ["Limited online presence", "Inconsistent quality", "Poor customer service", "Weak brand storytelling"],
      opportunities: ["Custom orders", "Subscription boxes", "Workshop experiences", "Corporate gifting", "Seasonal collections"],
      marketSize: "\u20B92.5M",
      growthRate: "12.5%",
      avgPrice: "\u20B91,950"
    };
    if (businessTypeLower.includes("pottery") || businessTypeLower.includes("ceramic")) {
      specificInsights = {
        trendingKeywords: ["hand-thrown pottery", "ceramic art", "functional ceramics", "sustainable clay", "artisan pottery", "custom glazes"],
        competitorGaps: ["Limited variety in glazes", "Poor packaging for shipping", "Inconsistent sizing", "Weak online presence"],
        opportunities: ["Custom dinnerware sets", "Pottery workshops", "Corporate gifts", "Restaurant partnerships", "Seasonal collections"],
        marketSize: "\u20B93.2M",
        growthRate: "15.3%",
        avgPrice: "\u20B92,200"
      };
    } else if (businessTypeLower.includes("jewelry") || businessTypeLower.includes("jewellery")) {
      specificInsights = {
        trendingKeywords: ["handcrafted jewelry", "artisan accessories", "unique designs", "sustainable materials", "custom jewelry", "traditional techniques"],
        competitorGaps: ["Limited size options", "Poor quality control", "Weak brand identity", "Inconsistent pricing"],
        opportunities: ["Custom engagement rings", "Bridal collections", "Corporate gifts", "Jewelry workshops", "Subscription boxes"],
        marketSize: "\u20B94.1M",
        growthRate: "18.7%",
        avgPrice: "\u20B93,500"
      };
    } else if (businessTypeLower.includes("textile") || businessTypeLower.includes("fabric")) {
      specificInsights = {
        trendingKeywords: ["handwoven textiles", "artisan fabrics", "sustainable materials", "traditional weaving", "custom textiles", "cultural heritage"],
        competitorGaps: ["Limited color options", "Poor quality control", "Weak online presence", "Inconsistent sizing"],
        opportunities: ["Custom upholstery", "Fashion collaborations", "Home decor partnerships", "Textile workshops", "Cultural tourism"],
        marketSize: "\u20B92.8M",
        growthRate: "14.2%",
        avgPrice: "\u20B91,800"
      };
    } else if (businessTypeLower.includes("wood") || businessTypeLower.includes("woodwork")) {
      specificInsights = {
        trendingKeywords: ["handcrafted woodwork", "artisan furniture", "sustainable wood", "traditional carving", "custom furniture", "wooden crafts"],
        competitorGaps: ["Limited customization", "Poor finishing", "Weak online presence", "Inconsistent quality"],
        opportunities: ["Custom furniture", "Corporate gifts", "Woodworking workshops", "Restaurant partnerships", "Home decor"],
        marketSize: "\u20B93.5M",
        growthRate: "16.8%",
        avgPrice: "\u20B94,200"
      };
    }
    let locationInsights = "";
    if (locationLower.includes("delhi") || locationLower.includes("mumbai") || locationLower.includes("bangalore")) {
      locationInsights = "Metropolitan areas show high demand for unique, handcrafted items with strong purchasing power and appreciation for artisan work.";
    } else if (locationLower.includes("india")) {
      locationInsights = "The Indian market is experiencing a renaissance in traditional crafts with growing appreciation for authentic, locally-made products.";
    } else {
      locationInsights = "Local markets are showing increasing interest in sustainable, handcrafted alternatives to mass-produced goods.";
    }
    return {
      summary: `Based on current market trends, your ${businessType || "handcrafted goods"} business shows strong potential in the sustainable and eco-friendly market segment. The ${location || "local"} market is growing at ${specificInsights.growthRate} annually with increasing demand for unique, locally-made products. ${locationInsights}`,
      recommendations: [
        "Focus on sustainability messaging to capture the growing eco-conscious market",
        "Consider expanding into digital marketplaces to reach a broader audience",
        "Implement dynamic pricing strategies based on seasonal demand patterns",
        "Develop a strong social media presence to engage with younger demographics",
        "Create limited edition collections to drive urgency and exclusivity",
        "Partner with local businesses and restaurants for B2B opportunities",
        "Offer workshops and experiences to build community and brand loyalty"
      ],
      marketInsights: {
        trendingKeywords: specificInsights.trendingKeywords,
        competitorGaps: specificInsights.competitorGaps,
        opportunities: specificInsights.opportunities
      },
      marketData: {
        localMarketSize: specificInsights.marketSize,
        globalMarketSize: "\u20B9125M",
        competitorCount: Math.floor(Math.random() * 30) + 25,
        // Random between 25-55
        averagePrice: specificInsights.avgPrice,
        growthRate: specificInsights.growthRate,
        trends: ["Sustainable materials", "Custom designs", "Local sourcing", "Digital integration", "Experience-based selling"]
      }
    };
  }
};

// server/routes/auth.ts
import { Router } from "express";

// server/services/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var JWT_EXPIRES_IN = "7d";
var connectionString = `postgresql://postgres.wlqqpvmlgecdhrmadipv:Openskills@123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
var client = postgres(connectionString);
var db = drizzle(client);
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password"
  }
});
var AuthService = class {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
  // Hash password
  async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
  // Generate verification token
  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }
  // Send verification email
  async sendVerificationEmail(email, token, firstName) {
    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "Verify Your Email - Artisan Marketplace",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Artisan Marketplace!</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The Artisan Marketplace Team</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  }
  // Send password reset email
  async sendPasswordResetEmail(email, token, firstName) {
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "Reset Your Password - Artisan Marketplace",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${firstName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Artisan Marketplace Team</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  }
  // Register new user
  async register(data) {
    try {
      const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (existingUser.length > 0) {
        throw new Error("User with this email already exists");
      }
      const existingUsername = await db.select().from(users).where(eq(users.username, data.username)).limit(1);
      if (existingUsername.length > 0) {
        throw new Error("Username already taken");
      }
      const hashedPassword = await this.hashPassword(data.password);
      const verificationToken = this.generateVerificationToken();
      const newUser = await db.insert(users).values({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
        artisanName: data.artisanName,
        businessName: data.businessName,
        location: data.location,
        phone: data.phone,
        emailVerificationToken: verificationToken,
        isEmailVerified: true
        // Users are verified immediately upon registration
      }).returning();
      const user = newUser[0];
      const token = this.generateToken(user.id);
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }
  // Login user
  async login(data) {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (userResult.length === 0) {
        throw new Error("Invalid email or password");
      }
      const user = userResult[0];
      const isPasswordValid = await this.comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }
      const token = this.generateToken(user.id);
      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }
  // Verify email
  async verifyEmail(token) {
    try {
      const userResult = await db.select().from(users).where(
        and(
          eq(users.emailVerificationToken, token),
          eq(users.isEmailVerified, false)
        )
      ).limit(1);
      if (userResult.length === 0) {
        return { success: false, message: "Invalid or expired verification token" };
      }
      const user = userResult[0];
      await db.update(users).set({
        isEmailVerified: true,
        emailVerificationToken: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      return { success: false, message: "Error verifying email" };
    }
  }
  // Forgot password
  async forgotPassword(data) {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (userResult.length === 0) {
        return { success: true, message: "If an account with this email exists, a password reset link has been sent" };
      }
      const user = userResult[0];
      const resetToken = this.generateVerificationToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1e3);
      await db.update(users).set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
      await this.sendPasswordResetEmail(user.email, resetToken, user.firstName || "User");
      return { success: true, message: "If an account with this email exists, a password reset link has been sent" };
    } catch (error) {
      return { success: false, message: "Error processing password reset request" };
    }
  }
  // Reset password
  async resetPassword(data) {
    try {
      const userResult = await db.select().from(users).where(
        and(
          eq(users.passwordResetToken, data.token),
          eq(users.passwordResetExpires, /* @__PURE__ */ new Date())
          // Check if token is not expired
        )
      ).limit(1);
      if (userResult.length === 0) {
        return { success: false, message: "Invalid or expired reset token" };
      }
      const user = userResult[0];
      if (user.passwordResetExpires && user.passwordResetExpires < /* @__PURE__ */ new Date()) {
        return { success: false, message: "Reset token has expired" };
      }
      const hashedPassword = await this.hashPassword(data.password);
      await db.update(users).set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      return { success: false, message: "Error resetting password" };
    }
  }
  // Get user by ID
  async getUserById(userId) {
    try {
      const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userResult.length === 0) {
        return null;
      }
      const user = userResult[0];
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }
  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const updatedUser = await db.update(users).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
      if (updatedUser.length === 0) {
        return null;
      }
      const user = updatedUser[0];
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }
  // Manual email verification for development/testing
  async verifyEmailManually(email) {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userResult.length === 0) {
        return { success: false, message: "User not found" };
      }
      const user = userResult[0];
      if (user.isEmailVerified) {
        return { success: true, message: "Email is already verified" };
      }
      await db.update(users).set({
        isEmailVerified: true,
        emailVerificationToken: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, user.id));
      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      return { success: false, message: "Error verifying email" };
    }
  }
};

// server/middleware/auth.ts
var authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    const authService2 = new AuthService();
    const user = await authService2.getUserById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// server/routes/auth.ts
import { ZodError } from "zod";
var router = Router();
var authService = new AuthService();
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json({
      success: true,
      message: "User registered successfully. You can now login.",
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    res.json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed"
    });
  }
});
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }
    const result = await authService.verifyEmail(token);
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email"
    });
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData);
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: "Error processing forgot password request"
    });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData);
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: "Error resetting password"
    });
  }
});
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user data"
    });
  }
});
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const updateData = req.body;
    const userId = req.user.id;
    delete updateData.id;
    delete updateData.password;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.emailVerificationToken;
    delete updateData.passwordResetToken;
    delete updateData.passwordResetExpires;
    const updatedUser = await authService.updateProfile(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  }
});
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});
router.post("/verify-email-manual", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    const result = await authService.verifyEmailManually(email);
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email"
    });
  }
});
var auth_default = router;

// server/routes.ts
async function registerRoutes(app2) {
  const geminiService = new GeminiService();
  app2.use("/api/auth", auth_default);
  app2.get("/api/products", async (req, res) => {
    try {
      const filters = productQuerySchema.parse({
        category: req.query.category,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : void 0,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : void 0,
        location: req.query.location,
        search: req.query.search
      });
      const products2 = await storage.getProducts(filters);
      res.json({ products: products2, total: products2.length });
    } catch (error) {
      res.status(400).json({
        error: "Invalid query parameters",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
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
  app2.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      if (!productData.artisanId) {
        return res.status(400).json({
          error: "Artisan ID is required",
          message: "Please ensure you are logged in as an artisan"
        });
      }
      const product = await storage.createProduct(productData);
      res.status(201).json({ product, message: "Product created successfully" });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(400).json({
        error: "Invalid product data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
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
  app2.delete("/api/products/:id", async (req, res) => {
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
  app2.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { query } = aiQuerySchema.parse(req.body);
      const allProducts = await storage.getProducts();
      let recommendations;
      try {
        recommendations = await getProductRecommendations(query, allProducts);
      } catch (aiError) {
        console.log("Using fallback AI for recommendations");
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
  app2.post("/api/ai/chat", async (req, res) => {
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
        aiResponse = await geminiService.generateChatResponse(query, {
          userType: "customer",
          previousMessages: Array.isArray(chatSession.messages) ? chatSession.messages : [],
          availableProducts: allProducts
        });
      } catch (aiError) {
        console.log("Using fallback AI for chat");
        aiResponse = FallbackAIService.generateChatResponse(query, allProducts);
      }
      const updatedMessages = [...Array.isArray(chatSession.messages) ? chatSession.messages : [], query, aiResponse];
      await storage.updateChatSession(chatSession.id, updatedMessages);
      res.json({
        response: aiResponse,
        sessionId: chatSession.id,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({
        error: "Chat request failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { userType, businessType, location, products: products2, userId } = req.body;
      const userProducts = userId ? await storage.getProductsByArtisan(userId) : await storage.getProducts();
      const analysis = FallbackAIService.generateMarketAnalysis(userType, businessType, location);
      res.json(analysis);
    } catch (error) {
      console.error("Market analysis error:", error);
      res.status(500).json({
        error: "Market analysis failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/ai/custom-analysis", async (req, res) => {
    try {
      const { query, context } = req.body;
      if (!query || !query.trim()) {
        return res.status(400).json({ error: "Query is required" });
      }
      const allProducts = await storage.getProducts();
      const response = FallbackAIService.generateChatResponse(query, allProducts);
      res.json({
        analysis: response,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Custom analysis error:", error);
      res.status(500).json({
        error: "Custom analysis failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      res.json({ orders: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/artisan/stats", async (req, res) => {
    try {
      const artisanId = req.query.artisan;
      if (!artisanId) {
        return res.status(400).json({ error: "Artisan ID is required" });
      }
      const products2 = await storage.getProductsByArtisan(artisanId);
      const totalProducts = products2.length;
      const totalSales = products2.reduce((sum, p) => sum + (p.sales || 0), 0);
      const totalRevenue = products2.reduce((sum, p) => sum + (p.sales || 0) * parseFloat(p.price), 0);
      const totalViews = products2.reduce((sum, p) => sum + (p.views || 0), 0);
      const avgRating = products2.length > 0 ? products2.reduce((sum, p) => sum + parseFloat(p.rating || "0"), 0) / products2.length : 0;
      const stats = {
        totalProducts,
        totalSales,
        totalRevenue,
        totalViews,
        avgRating,
        pendingOrders: 0,
        // Will be implemented with orders
        thisMonthRevenue: totalRevenue,
        // Simplified for now
        thisMonthSales: totalSales
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artisan stats" });
    }
  });
  app2.get("/api/artisan/:id/products", async (req, res) => {
    try {
      const products2 = await storage.getProductsByArtisan(req.params.id);
      res.json({ products: products2 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artisan products" });
    }
  });
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    configFile: path.resolve(__dirname, "..", "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
