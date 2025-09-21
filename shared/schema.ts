import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: json("address"),
  userType: text("user_type").notNull().default("customer"), // 'artisan' or 'customer'
  artisanName: text("artisan_name"),
  businessName: text("business_name"),
  location: text("location"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  images: json("images").notNull(), // Array of image URLs
  model3d: text("model_3d"), // 3D model file path
  artisanId: varchar("artisan_id").references(() => users.id).notNull(),
  artisanName: text("artisan_name").notNull(),
  location: text("location").notNull(),
  status: text("status").default("active"), // 'active', 'inactive', 'sold'
  stock: integer("stock").default(0),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: json("dimensions"), // {length, width, height}
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  artisanId: varchar("artisan_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  paymentId: text("payment_id"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cart = pgTable("cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'product_view', 'sale', 'revenue', etc.
  data: json("data").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  artisanId: varchar("artisan_id").references(() => users.id),
  messages: json("messages").notNull().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketAnalysis = pgTable("market_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  artisanId: varchar("artisan_id").references(() => users.id),
  analysisType: text("analysis_type").notNull(), // 'local_market', 'global_market', 'pricing'
  data: json("data").notNull(),
  insights: text("insights"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  userType: z.enum(['artisan', 'customer']),
  artisanName: z.string().optional(),
  businessName: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// Product schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  views: true,
  likes: true,
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  artisanId: z.string().optional(),
  artisan: z.string().optional(), // For artisan filtering
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['price', 'createdAt', 'views', 'likes', 'sales', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Order schemas
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  paymentStatus: true,
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string(),
  notes: z.string().optional(),
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});

// Review schemas
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// AI schemas
export const aiQuerySchema = z.object({
  query: z.string().min(1),
  sessionId: z.string().optional(),
  context: z.string().optional(),
});

export const marketAnalysisSchema = z.object({
  productId: z.string().optional(),
  artisanId: z.string().optional(),
  analysisType: z.enum(['local_market', 'global_market', 'pricing', 'competition']),
  productData: z.object({
    name: z.string(),
    category: z.string(),
    price: z.number(),
    description: z.string(),
    materials: z.array(z.string()).optional(),
  }),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type ProductQuery = z.infer<typeof productQuerySchema>;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type CartItem = typeof cart.$inferSelect;
export type AddToCartData = z.infer<typeof addToCartSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type AIQuery = z.infer<typeof aiQuerySchema>;
export type MarketAnalysis = typeof marketAnalysis.$inferSelect;
export type MarketAnalysisData = z.infer<typeof marketAnalysisSchema>;
