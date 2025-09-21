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
    // No manual data - all products will be added through the API
    // This ensures a clean database for artisan product management
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
      
      if (filters.subcategory) {
        products = products.filter(p => 
          p.subcategory?.toLowerCase().includes(filters.subcategory!.toLowerCase())
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
      
      if (filters.artisanId) {
        products = products.filter(p => p.artisanId === filters.artisanId);
      }
      
      if (filters.artisan) {
        products = products.filter(p => 
          p.artisanName.toLowerCase().includes(filters.artisan!.toLowerCase())
        );
      }
      
      if (filters.isFeatured !== undefined) {
        products = products.filter(p => p.isFeatured === filters.isFeatured);
      }
      
      if (filters.isActive !== undefined) {
        products = products.filter(p => p.isActive === filters.isActive);
      }
      
      if (filters.materials && filters.materials.length > 0) {
        products = products.filter(p => 
          p.materials?.some(material => 
            filters.materials!.some(filterMaterial => 
              material.toLowerCase().includes(filterMaterial.toLowerCase())
            )
          )
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        products = products.filter(p => 
          p.tags?.some(tag => 
            filters.tags!.some(filterTag => 
              tag.toLowerCase().includes(filterTag.toLowerCase())
            )
          )
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

    // Sort products
    if (filters?.sortBy) {
      const sortBy = filters.sortBy;
      const sortOrder = filters.sortOrder || 'desc';
      
      products.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'price':
            aValue = parseFloat(a.price);
            bValue = parseFloat(b.price);
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt!).getTime();
            bValue = new Date(b.createdAt!).getTime();
            break;
          case 'views':
            aValue = a.views || 0;
            bValue = b.views || 0;
            break;
          case 'likes':
            aValue = a.likes || 0;
            bValue = b.likes || 0;
            break;
          case 'sales':
            aValue = a.sales || 0;
            bValue = b.sales || 0;
            break;
          case 'rating':
            aValue = parseFloat(a.rating || '0');
            bValue = parseFloat(b.rating || '0');
            break;
          default:
            aValue = new Date(a.createdAt!).getTime();
            bValue = new Date(b.createdAt!).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    } else {
      // Default sort by creation date (newest first)
      products.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }

    return products;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      ...updates, 
      updatedAt: new Date() 
    };
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
