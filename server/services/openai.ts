import OpenAI from "openai";
import type { Product } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AIRecommendation {
  products: Product[];
  explanation: string;
  confidence: number;
}

export async function getProductRecommendations(
  query: string, 
  allProducts: Product[]
): Promise<AIRecommendation> {
  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for ArtisanAI, a marketplace for handcrafted items. 
          Your job is to recommend products based on user queries. 
          
          Available products: ${JSON.stringify(allProducts.map(p => ({
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
          - Price ranges (₹, $, €)
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
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    const recommendedProducts = allProducts.filter(product => 
      result.recommendedProductIds?.includes(product.id)
    );

    return {
      products: recommendedProducts,
      explanation: result.explanation || "Here are some products that might interest you.",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    // Fallback to simple text matching if OpenAI fails
    const searchTerms = query.toLowerCase();
    const fallbackProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerms) ||
      product.description.toLowerCase().includes(searchTerms) ||
      product.category.toLowerCase().includes(searchTerms)
    ).slice(0, 6);

    return {
      products: fallbackProducts,
      explanation: "I found some products that might match your query. (AI assistant is temporarily unavailable)",
      confidence: 0.3
    };
  }
}

export async function generateChatResponse(
  userMessage: string,
  products: Product[],
  conversationHistory: string[] = []
): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a friendly AI shopping assistant for ArtisanAI, helping customers discover unique handcrafted items. 
          
          Be conversational, helpful, and enthusiastic about artisan products. 
          Help users find products, learn about artisans, and discover new categories.
          
          If users ask about specific products, pricing, or categories, refer to the available products.
          Keep responses concise but informative.
          
          Available products: ${JSON.stringify(products.slice(0, 10).map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            artisanName: p.artisanName,
            location: p.location
          })))}`
        },
        ...conversationHistory.slice(-6).map((msg, index) => ({
          role: index % 2 === 0 ? "user" as const : "assistant" as const,
          content: msg
        })),
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    return response.choices[0].message.content || "I'm here to help you find amazing artisan products! What are you looking for?";
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return "I'm having trouble connecting right now, but I'm here to help you discover amazing handcrafted items! Try asking about specific categories like jewelry, pottery, or textiles.";
  }
}
