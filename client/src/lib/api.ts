import { apiRequest } from "./queryClient";
import type { Product, InsertProduct, ProductQuery } from "@shared/schema";

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface AIRecommendationResponse {
  products: Product[];
  explanation: string;
  confidence: number;
}

export interface AIChatResponse {
  response: string;
  sessionId: string;
  timestamp: string;
}

export const api = {
  // Products
  async getProducts(filters?: ProductQuery): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiRequest("GET", `/api/products?${params.toString()}`);
    return response.json();
  },

  async getProduct(id: string): Promise<{ product: Product }> {
    const response = await apiRequest("GET", `/api/products/${id}`);
    return response.json();
  },

  async createProduct(product: InsertProduct): Promise<{ product: Product }> {
    const response = await apiRequest("POST", "/api/products", product);
    return response.json();
  },

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<{ product: Product }> {
    const response = await apiRequest("PUT", `/api/products/${id}`, product);
    return response.json();
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await apiRequest("DELETE", `/api/products/${id}`);
    return response.json();
  },

  // AI Services
  async getAIRecommendations(query: string): Promise<AIRecommendationResponse> {
    const response = await apiRequest("POST", "/api/ai/recommendations", { query });
    return response.json();
  },

  async sendChatMessage(query: string, sessionId?: string): Promise<AIChatResponse> {
    const response = await apiRequest("POST", "/api/ai/chat", { query, sessionId });
    return response.json();
  },

  // Orders
  async getOrders(filters?: { user?: string; artisan?: string; limit?: number }): Promise<{ orders: any[] }> {
    const params = new URLSearchParams();
    if (filters?.user) params.append("user", filters.user);
    if (filters?.artisan) params.append("artisan", filters.artisan);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiRequest("GET", `/api/orders?${params.toString()}`);
    return response.json();
  },

  // Artisan Stats
  async getArtisanStats(filters?: { artisan?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.artisan) params.append("artisan", filters.artisan);

    const response = await apiRequest("GET", `/api/artisan/stats?${params.toString()}`);
    return response.json();
  },

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
};
