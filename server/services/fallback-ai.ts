import { Product } from '../../shared/schema';

export class FallbackAIService {
  // Simple keyword-based product recommendations
  static getProductRecommendations(query: string, products: Product[]): {
    products: Product[];
    explanation: string;
    confidence: number;
  } {
    const searchTerms = query.toLowerCase().split(' ');
    const matchedProducts = products.filter(product => {
      const productText = `${product.name} ${product.description} ${product.category} ${product.materials?.join(' ') || ''}`.toLowerCase();
      return searchTerms.some(term => productText.includes(term));
    });

    return {
      products: matchedProducts.slice(0, 5),
      explanation: `I found ${matchedProducts.length} products that match your search for "${query}". These are handcrafted items that might interest you!`,
      confidence: matchedProducts.length > 0 ? 0.7 : 0.3
    };
  }

  // Simple chat responses based on keywords
  static generateChatResponse(message: string, products: Product[]): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! I'm your AI shopping assistant for artisan products. I can help you find unique handcrafted items like pottery, jewelry, textiles, and more. What are you looking for today?";
    }
    
    if (msg.includes('pottery') || msg.includes('ceramic') || msg.includes('clay')) {
      const potteryProducts = products.filter(p => p.category.toLowerCase().includes('pottery') || p.name.toLowerCase().includes('pottery'));
      if (potteryProducts.length > 0) {
        return `I found ${potteryProducts.length} beautiful pottery items! We have handcrafted ceramic pieces ranging from ₹${Math.min(...potteryProducts.map(p => parseFloat(p.price)))} to ₹${Math.max(...potteryProducts.map(p => parseFloat(p.price)))}. Each piece is unique and made by skilled artisans. Would you like to see specific items?`;
      }
      return "We have beautiful handcrafted pottery items! Our artisans create unique ceramic pieces using traditional techniques. Each item is one-of-a-kind and perfect for adding character to your home.";
    }
    
    if (msg.includes('jewelry') || msg.includes('jewellery') || msg.includes('necklace') || msg.includes('ring')) {
      const jewelryProducts = products.filter(p => p.category.toLowerCase().includes('jewelry') || p.name.toLowerCase().includes('jewelry'));
      if (jewelryProducts.length > 0) {
        return `I found ${jewelryProducts.length} stunning jewelry pieces! We have handcrafted accessories ranging from ₹${Math.min(...jewelryProducts.map(p => parseFloat(p.price)))} to ₹${Math.max(...jewelryProducts.map(p => parseFloat(p.price)))}. Each piece is carefully crafted by skilled artisans. Would you like to explore our collection?`;
      }
      return "We have exquisite handcrafted jewelry! Our artisans create beautiful accessories using traditional techniques and quality materials. Each piece tells a story of craftsmanship and artistry.";
    }
    
    if (msg.includes('textile') || msg.includes('fabric') || msg.includes('cloth') || msg.includes('weaving')) {
      const textileProducts = products.filter(p => p.category.toLowerCase().includes('textile') || p.name.toLowerCase().includes('textile'));
      if (textileProducts.length > 0) {
        return `I found ${textileProducts.length} beautiful textile items! We have handwoven fabrics and textile art ranging from ₹${Math.min(...textileProducts.map(p => parseFloat(p.price)))} to ₹${Math.max(...textileProducts.map(p => parseFloat(p.price)))}. Each piece showcases traditional weaving techniques. Would you like to see our collection?`;
      }
      return "We have beautiful handcrafted textiles! Our artisans create stunning fabrics using traditional weaving techniques. Each piece is unique and showcases the rich heritage of textile arts.";
    }
    
    if (msg.includes('wood') || msg.includes('woodwork') || msg.includes('carving')) {
      const woodProducts = products.filter(p => p.category.toLowerCase().includes('wood') || p.name.toLowerCase().includes('wood'));
      if (woodProducts.length > 0) {
        return `I found ${woodProducts.length} beautiful woodwork items! We have handcrafted wooden pieces ranging from ₹${Math.min(...woodProducts.map(p => parseFloat(p.price)))} to ₹${Math.max(...woodProducts.map(p => parseFloat(p.price)))}. Each piece is carefully carved and finished by skilled artisans. Would you like to explore our collection?`;
      }
      return "We have exquisite handcrafted woodwork! Our artisans create beautiful wooden items using traditional carving techniques. Each piece is unique and showcases the natural beauty of wood.";
    }
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('expensive') || msg.includes('cheap')) {
      const priceRange = products.length > 0 ? {
        min: Math.min(...products.map(p => parseFloat(p.price))),
        max: Math.max(...products.map(p => parseFloat(p.price)))
      } : { min: 0, max: 0 };
      
      return `Our handcrafted items range from ₹${priceRange.min} to ₹${priceRange.max}. Each piece is priced based on the materials used, time invested, and the artisan's skill. Remember, you're not just buying a product - you're supporting traditional craftsmanship and getting a unique, one-of-a-kind item!`;
    }
    
    if (msg.includes('artisan') || msg.includes('maker') || msg.includes('craftsman')) {
      const uniqueArtisans = [...new Set(products.map(p => p.artisanName))];
      return `We work with ${uniqueArtisans.length} talented artisans from different regions! Each artisan brings their unique style and traditional techniques to their work. You can find items from artisans in ${[...new Set(products.map(p => p.location))].join(', ')}. Each purchase directly supports these skilled craftspeople and helps preserve traditional arts.`;
    }
    
    if (msg.includes('custom') || msg.includes('personalized') || msg.includes('bespoke')) {
      return "Many of our artisans offer custom and personalized items! You can request specific colors, sizes, or designs. Custom orders typically take 2-4 weeks to complete and are perfect for special occasions or unique gifts. Would you like me to help you find artisans who offer custom work?";
    }
    
    if (msg.includes('gift') || msg.includes('present') || msg.includes('occasion')) {
      return "Handcrafted items make perfect gifts! They're unique, meaningful, and support local artisans. We have items for every occasion - from everyday jewelry to special home decor. Each piece comes with the story of its maker, making it a truly special gift. What kind of gift are you looking for?";
    }
    
    if (msg.includes('quality') || msg.includes('durable') || msg.includes('lasting')) {
      return "All our products are made with high-quality materials and traditional techniques that have been refined over generations. Each artisan takes pride in their work and ensures every piece meets their standards. Handcrafted items often last longer than mass-produced alternatives because they're made with care and attention to detail.";
    }
    
    if (msg.includes('sustainable') || msg.includes('eco') || msg.includes('environment')) {
      return "Many of our artisans use sustainable and eco-friendly materials! Handcrafted items often have a smaller environmental footprint than mass-produced goods. Our artisans use natural materials, traditional techniques, and often source materials locally. You're supporting both traditional crafts and environmental sustainability!";
    }
    
    // Default response
    return "I'm here to help you discover amazing handcrafted items! We have beautiful pottery, jewelry, textiles, woodwork, and more from skilled artisans. Each piece is unique and tells a story of traditional craftsmanship. What type of item interests you most?";
  }

  // Market analysis fallback
  static generateMarketAnalysis(userType: string, businessType: string, location: string): any {
    // Generate dynamic analysis based on business type and location
    const businessTypeLower = (businessType || 'handcrafted goods').toLowerCase();
    const locationLower = (location || 'local').toLowerCase();
    
    // Customize analysis based on business type
    let specificInsights = {
      trendingKeywords: ["sustainable", "handmade", "eco-friendly", "local artisan", "unique design", "custom", "traditional craft"],
      competitorGaps: ["Limited online presence", "Inconsistent quality", "Poor customer service", "Weak brand storytelling"],
      opportunities: ["Custom orders", "Subscription boxes", "Workshop experiences", "Corporate gifting", "Seasonal collections"],
      marketSize: "₹2.5M",
      growthRate: "12.5%",
      avgPrice: "₹1,950"
    };

    if (businessTypeLower.includes('pottery') || businessTypeLower.includes('ceramic')) {
      specificInsights = {
        trendingKeywords: ["hand-thrown pottery", "ceramic art", "functional ceramics", "sustainable clay", "artisan pottery", "custom glazes"],
        competitorGaps: ["Limited variety in glazes", "Poor packaging for shipping", "Inconsistent sizing", "Weak online presence"],
        opportunities: ["Custom dinnerware sets", "Pottery workshops", "Corporate gifts", "Restaurant partnerships", "Seasonal collections"],
        marketSize: "₹3.2M",
        growthRate: "15.3%",
        avgPrice: "₹2,200"
      };
    } else if (businessTypeLower.includes('jewelry') || businessTypeLower.includes('jewellery')) {
      specificInsights = {
        trendingKeywords: ["handcrafted jewelry", "artisan accessories", "unique designs", "sustainable materials", "custom jewelry", "traditional techniques"],
        competitorGaps: ["Limited size options", "Poor quality control", "Weak brand identity", "Inconsistent pricing"],
        opportunities: ["Custom engagement rings", "Bridal collections", "Corporate gifts", "Jewelry workshops", "Subscription boxes"],
        marketSize: "₹4.1M",
        growthRate: "18.7%",
        avgPrice: "₹3,500"
      };
    } else if (businessTypeLower.includes('textile') || businessTypeLower.includes('fabric')) {
      specificInsights = {
        trendingKeywords: ["handwoven textiles", "artisan fabrics", "sustainable materials", "traditional weaving", "custom textiles", "cultural heritage"],
        competitorGaps: ["Limited color options", "Poor quality control", "Weak online presence", "Inconsistent sizing"],
        opportunities: ["Custom upholstery", "Fashion collaborations", "Home decor partnerships", "Textile workshops", "Cultural tourism"],
        marketSize: "₹2.8M",
        growthRate: "14.2%",
        avgPrice: "₹1,800"
      };
    } else if (businessTypeLower.includes('wood') || businessTypeLower.includes('woodwork')) {
      specificInsights = {
        trendingKeywords: ["handcrafted woodwork", "artisan furniture", "sustainable wood", "traditional carving", "custom furniture", "wooden crafts"],
        competitorGaps: ["Limited customization", "Poor finishing", "Weak online presence", "Inconsistent quality"],
        opportunities: ["Custom furniture", "Corporate gifts", "Woodworking workshops", "Restaurant partnerships", "Home decor"],
        marketSize: "₹3.5M",
        growthRate: "16.8%",
        avgPrice: "₹4,200"
      };
    }

    // Customize based on location
    let locationInsights = "";
    if (locationLower.includes('delhi') || locationLower.includes('mumbai') || locationLower.includes('bangalore')) {
      locationInsights = "Metropolitan areas show high demand for unique, handcrafted items with strong purchasing power and appreciation for artisan work.";
    } else if (locationLower.includes('india')) {
      locationInsights = "The Indian market is experiencing a renaissance in traditional crafts with growing appreciation for authentic, locally-made products.";
    } else {
      locationInsights = "Local markets are showing increasing interest in sustainable, handcrafted alternatives to mass-produced goods.";
    }

    return {
      summary: `Based on current market trends, your ${businessType || 'handcrafted goods'} business shows strong potential in the sustainable and eco-friendly market segment. The ${location || 'local'} market is growing at ${specificInsights.growthRate} annually with increasing demand for unique, locally-made products. ${locationInsights}`,
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
        globalMarketSize: "₹125M",
        competitorCount: Math.floor(Math.random() * 30) + 25, // Random between 25-55
        averagePrice: specificInsights.avgPrice,
        growthRate: specificInsights.growthRate,
        trends: ["Sustainable materials", "Custom designs", "Local sourcing", "Digital integration", "Experience-based selling"]
      }
    };
  }
}
