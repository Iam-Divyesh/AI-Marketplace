import { type User, type InsertUser, type Product, type InsertProduct, type ChatSession, type ProductQuery } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(filters?: ProductQuery): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getProductsByArtisan(artisanId: string): Promise<Product[]>;
  
  // Chat methods
  createChatSession(userId?: string): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  updateChatSession(id: string, messages: string[]): Promise<ChatSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.chatSessions = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample artisan users
    const sampleUsers: User[] = [
      {
        id: "user1",
        username: "maya_sharma",
        password: "hashed_password",
        email: "maya@example.com",
        artisanName: "Maya Sharma",
        location: "Jaipur, India",
        createdAt: new Date(),
      },
      {
        id: "user2",
        username: "david_chen",
        password: "hashed_password",
        email: "david@example.com",
        artisanName: "David Chen",
        location: "San Francisco, USA",
        createdAt: new Date(),
      },
      {
        id: "user3",
        username: "priya_patel",
        password: "hashed_password",
        email: "priya@example.com",
        artisanName: "Priya Patel",
        location: "Mumbai, India",
        createdAt: new Date(),
      },
      {
        id: "user4",
        username: "james_wilson",
        password: "hashed_password",
        email: "james@example.com",
        artisanName: "James Wilson",
        location: "Portland, USA",
        createdAt: new Date(),
      },
      {
        id: "user5",
        username: "elena_rodriguez",
        password: "hashed_password",
        email: "elena@example.com",
        artisanName: "Elena Rodriguez",
        location: "Barcelona, Spain",
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: "prod1",
        name: "Ceramic Blue Vase",
        description: "Handcrafted ceramic vase with intricate blue and white patterns, perfect for home decoration.",
        category: "Pottery",
        price: "1200.00",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "Maya Sharma",
        artisanId: "user1",
        location: "Jaipur, India",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod2",
        name: "Silver Moon Necklace",
        description: "Elegant silver jewelry with gemstones and intricate details, handcrafted with love.",
        category: "Jewelry",
        price: "2800.00",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "David Chen",
        artisanId: "user2",
        location: "San Francisco, USA",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod3",
        name: "Traditional Weave Scarf",
        description: "Beautiful woven textile with colorful traditional patterns, made from premium materials.",
        category: "Textiles",
        price: "850.00",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "Priya Patel",
        artisanId: "user3",
        location: "Mumbai, India",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod4",
        name: "Carved Wood Bird",
        description: "Wooden sculpture with smooth finish and artistic carved details, a masterpiece of woodcraft.",
        category: "Woodwork",
        price: "1500.00",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "James Wilson",
        artisanId: "user4",
        location: "Portland, USA",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod5",
        name: "Artisan Ceramic Bowl",
        description: "Colorful handmade pottery bowl with artistic glazing, perfect for serving or decoration.",
        category: "Pottery",
        price: "650.00",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "Elena Rodriguez",
        artisanId: "user5",
        location: "Barcelona, Spain",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod6",
        name: "Macrame Wall Art",
        description: "Intricate macrame wall hanging with natural fibers, adds bohemian charm to any space.",
        category: "Textiles",
        price: "950.00",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "Priya Patel",
        artisanId: "user3",
        location: "Mumbai, India",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod7",
        name: "Leather Craft Wallet",
        description: "Handcrafted leather goods with detailed stitching, durable and stylish everyday accessory.",
        category: "Leather",
        price: "1800.00",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "James Wilson",
        artisanId: "user4",
        location: "Portland, USA",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "prod8",
        name: "Glass Art Sphere",
        description: "Beautiful glass art piece with iridescent colors, a stunning centerpiece for any room.",
        category: "Glass Art",
        price: "3200.00",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        artisanName: "Elena Rodriguez",
        artisanId: "user5",
        location: "Barcelona, Spain",
        status: "active",
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      artisanName: insertUser.artisanName || null,
      location: insertUser.location || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(filters?: ProductQuery): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.status === "active");

    if (filters) {
      if (filters.category) {
        products = products.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      if (filters.minPrice) {
        products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
      }
      
      if (filters.maxPrice) {
        products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
      }
      
      if (filters.location) {
        products = products.filter(p => 
          p.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm) ||
          p.artisanName.toLowerCase().includes(searchTerm)
        );
      }
    }

    return products.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      artisanId: insertProduct.artisanId || null,
      status: "active",
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getProductsByArtisan(artisanId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => 
      p.artisanId === artisanId && p.status === "active"
    );
  }

  async createChatSession(userId?: string): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      id,
      userId: userId || null,
      messages: [],
      createdAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async updateChatSession(id: string, messages: string[]): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, messages };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
