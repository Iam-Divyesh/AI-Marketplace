import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product, MarketAnalysisData } from '../../shared/schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Market analysis for products
  async analyzeMarket(data: MarketAnalysisData): Promise<{
    insights: string;
    recommendations: string;
    marketData: any;
  }> {
    try {
      const prompt = `
        Analyze the market for this product and provide comprehensive insights:
        
        Product Details:
        - Name: ${data.productData.name}
        - Category: ${data.productData.category}
        - Price: $${data.productData.price}
        - Description: ${data.productData.description}
        - Materials: ${data.productData.materials?.join(', ') || 'Not specified'}
        
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
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          insights: text,
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
      console.error('Gemini market analysis error:', error);
      throw new Error('Failed to analyze market data');
    }
  }

  // Product recommendations based on user preferences
  async getProductRecommendations(
    userPreferences: string,
    availableProducts: Product[]
  ): Promise<{
    recommendations: Array<{
      productId: string;
      reason: string;
      confidence: number;
    }>;
    explanation: string;
  }> {
    try {
      const productList = availableProducts.map(p => ({
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
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (parseError) {
        return {
          recommendations: [],
          explanation: "Unable to generate recommendations at this time."
        };
      }
    } catch (error) {
      console.error('Gemini recommendation error:', error);
      throw new Error('Failed to generate product recommendations');
    }
  }

  // Generate product descriptions
  async generateProductDescription(productData: {
    name: string;
    category: string;
    materials: string[];
    artisanName: string;
    location: string;
  }): Promise<string> {
    try {
      const prompt = `
        Generate an engaging product description for an artisan marketplace:
        
        Product: ${productData.name}
        Category: ${productData.category}
        Materials: ${productData.materials.join(', ')}
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
      console.error('Gemini description generation error:', error);
      return `A beautiful handcrafted ${productData.name} made by ${productData.artisanName} using traditional techniques and quality materials.`;
    }
  }

  // Chat assistance for customers and artisans
  async generateChatResponse(
    message: string,
    context: {
      userType: 'customer' | 'artisan';
      previousMessages?: string[];
      availableProducts?: Product[];
    }
  ): Promise<string> {
    try {
      const contextInfo = context.userType === 'artisan' 
        ? 'You are helping an artisan with their business on the marketplace.'
        : 'You are helping a customer find products and answer questions.';

      const productContext = context.availableProducts?.length 
        ? `Available products: ${context.availableProducts.map(p => `${p.name} - $${p.price}`).join(', ')}`
        : '';

      const prompt = `
        ${contextInfo}
        
        ${productContext}
        
        User message: "${message}"
        
        Previous conversation: ${context.previousMessages?.join('\n') || 'None'}
        
        Provide a helpful, friendly response. If you're helping a customer, suggest relevant products. If you're helping an artisan, provide business advice.
        Keep responses concise but informative.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  }

  // Generate SEO-friendly content
  async generateSEOContent(product: Product): Promise<{
    title: string;
    metaDescription: string;
    keywords: string[];
  }> {
    try {
      const prompt = `
        Generate SEO content for this product:
        
        Name: ${product.name}
        Category: ${product.category}
        Description: ${product.description}
        Materials: ${product.materials?.join(', ') || 'Not specified'}
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
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          title: product.name,
          metaDescription: product.description.substring(0, 160),
          keywords: [product.category, product.materials?.[0] || 'handcrafted']
        };
      }
    } catch (error) {
      console.error('Gemini SEO generation error:', error);
      return {
        title: product.name,
        metaDescription: product.description.substring(0, 160),
        keywords: [product.category, 'handcrafted', 'artisan']
      };
    }
  }
}
