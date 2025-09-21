import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  MapPin, 
  DollarSign, 
  Users, 
  BarChart3,
  Zap,
  Lightbulb,
  Target,
  AlertCircle,
  Loader2,
  RefreshCw,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const marketData = {
  localMarket: {
    size: '₹2.5M',
    growth: 12.5,
    competition: 45,
    avgPrice: 2500,
    trends: ['Sustainable materials', 'Custom designs', 'Local sourcing']
  },
  globalMarket: {
    size: '₹125M',
    growth: 8.2,
    competition: 1200,
    avgPrice: 1800,
    trends: ['Eco-friendly', 'Minimalist design', 'Digital integration']
  },
  pricing: {
    yourAvg: 2200,
    marketAvg: 1950,
    recommended: 2100,
    factors: ['Quality premium', 'Brand recognition', 'Unique design']
  }
};

const competitorAnalysis = [
  {
    name: 'ArtisanCraft Co.',
    rating: 4.8,
    price: 1800,
    sales: 120,
    strengths: ['Strong brand', 'Quality products'],
    weaknesses: ['Limited variety', 'High prices']
  },
  {
    name: 'Handmade Treasures',
    rating: 4.6,
    price: 1600,
    sales: 95,
    strengths: ['Affordable', 'Good variety'],
    weaknesses: ['Inconsistent quality', 'Poor customer service']
  },
  {
    name: 'Craft Masters',
    rating: 4.9,
    price: 2400,
    sales: 85,
    strengths: ['Premium quality', 'Unique designs'],
    weaknesses: ['Limited availability', 'Slow shipping']
  }
];

const recommendations = [
  {
    type: 'pricing',
    title: 'Optimize Pricing Strategy',
    description: 'Consider reducing prices by 5-10% to increase competitiveness while maintaining quality margins.',
    impact: 'High',
    effort: 'Low'
  },
  {
    type: 'marketing',
    title: 'Focus on Sustainability',
    description: 'Highlight eco-friendly materials and processes to appeal to environmentally conscious customers.',
    impact: 'Medium',
    effort: 'Medium'
  },
  {
    type: 'product',
    title: 'Expand Product Range',
    description: 'Add more affordable options to capture price-sensitive market segments.',
    impact: 'High',
    effort: 'High'
  },
  {
    type: 'marketing',
    title: 'Improve Online Presence',
    description: 'Enhance product photography and descriptions to increase conversion rates.',
    impact: 'Medium',
    effort: 'Low'
  }
];

export function MarketAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [isCustomAnalyzing, setIsCustomAnalyzing] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateAIAnalysis = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating market analysis...', {
        userType: 'artisan',
        businessType: user?.businessType || 'handcrafted goods',
        location: user?.location || 'India',
        products: selectedProduct,
        userId: user?.id
      });

      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: 'artisan',
          businessType: user?.businessType || 'handcrafted goods',
          location: user?.location || 'India',
          products: selectedProduct,
          userId: user?.id
        })
      });
      
      console.log('Market analysis response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Market analysis data received:', data);
        setAiAnalysis(data);
        toast({
          title: "Market Analysis Generated",
          description: "AI-powered market insights have been generated successfully!",
        });
      } else {
        const errorData = await response.json();
        console.error('Market analysis API error:', errorData);
        // Fallback to mock data if API fails
        setAiAnalysis({
          summary: "Based on current market trends, your handcrafted goods business shows strong potential in the sustainable and eco-friendly market segment. The local market is growing at 12.5% annually with increasing demand for unique, locally-made products.",
          recommendations: [
            "Focus on sustainability messaging to capture the growing eco-conscious market",
            "Consider expanding into digital marketplaces to reach a broader audience",
            "Implement dynamic pricing strategies based on seasonal demand patterns",
            "Develop a strong social media presence to engage with younger demographics"
          ],
          marketInsights: {
            trendingKeywords: ["sustainable", "handmade", "eco-friendly", "local artisan", "unique design"],
            competitorGaps: ["Limited online presence", "Inconsistent quality", "Poor customer service"],
            opportunities: ["Custom orders", "Subscription boxes", "Workshop experiences", "Corporate gifting"]
          }
        });
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      // Fallback to mock data
      setAiAnalysis({
        summary: "AI analysis temporarily unavailable. Using cached insights.",
        recommendations: recommendations,
        marketInsights: {
          trendingKeywords: ["sustainable", "handmade", "eco-friendly"],
          competitorGaps: ["Limited online presence"],
          opportunities: ["Custom orders", "Workshop experiences"]
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomAnalysis = async () => {
    if (!customQuery.trim()) return;
    
    setIsCustomAnalyzing(true);
    try {
      const response = await fetch('/api/ai/custom-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: customQuery,
          context: {
            userType: 'artisan',
            businessType: user?.businessType,
            location: user?.location
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(prev => ({
          ...prev,
          customAnalysis: data.analysis || data
        }));
      } else {
        const errorData = await response.json();
        console.error('Custom analysis API error:', errorData);
        setAiAnalysis(prev => ({
          ...prev,
          customAnalysis: "Sorry, I couldn't process your request right now. Please try again later."
        }));
      }
    } catch (error) {
      console.error('Error generating custom analysis:', error);
    } finally {
      setIsCustomAnalyzing(false);
    }
  };

  useEffect(() => {
    // Generate initial analysis on component mount
    generateAIAnalysis();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time insights powered by Gemini AI and Google Studio
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={generateAIAnalysis}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Analyzing...' : 'Refresh Analysis'}
              </Button>
              <Button onClick={generateAIAnalysis} disabled={isGenerating}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate New Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              AI Market Summary
              {isGenerating && (
                <Badge variant="secondary" className="ml-2">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {aiAnalysis.summary}
              </p>
            </div>
            
            {aiAnalysis.marketInsights && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Trending Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.marketInsights.trendingKeywords?.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Competitor Gaps</h4>
                  <ul className="text-sm space-y-1">
                    {aiAnalysis.marketInsights.competitorGaps?.map((gap: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Opportunities</h4>
                  <ul className="text-sm space-y-1">
                    {aiAnalysis.marketInsights.opportunities?.map((opportunity: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Analysis Query */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Ask AI Anything
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Ask specific questions about market trends, competitor analysis, pricing strategies, or any other business insights..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={generateCustomAnalysis}
              disabled={isCustomAnalyzing || !customQuery.trim()}
              className="w-full sm:w-auto"
            >
              {isCustomAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {isCustomAnalyzing ? 'Analyzing...' : 'Ask AI'}
            </Button>
          </div>
          
          {aiAnalysis?.customAnalysis && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">AI Response:</h4>
              <p className="text-sm text-muted-foreground">
                {aiAnalysis.customAnalysis}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Analysis</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Market Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local Market */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  Local Market
                  {isGenerating && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Size</p>
                    <p className="text-2xl font-bold">
                      {isGenerating ? (
                        <div className="h-8 bg-muted animate-pulse rounded" />
                      ) : (
                        aiAnalysis?.marketData?.localMarketSize || marketData.localMarket.size
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-2xl font-bold text-green-500">
                        {isGenerating ? (
                          <div className="h-8 bg-muted animate-pulse rounded w-16" />
                        ) : (
                          `+${aiAnalysis?.marketData?.growthRate || marketData.localMarket.growth}%`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Competitors</p>
                    <p className="text-xl font-semibold">
                      {isGenerating ? (
                        <div className="h-6 bg-muted animate-pulse rounded w-12" />
                      ) : (
                        aiAnalysis?.marketData?.competitorCount || marketData.localMarket.competition
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                    <p className="text-xl font-semibold">
                      {isGenerating ? (
                        <div className="h-6 bg-muted animate-pulse rounded w-16" />
                      ) : (
                        `₹${aiAnalysis?.marketData?.averagePrice || marketData.localMarket.avgPrice}`
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Trending Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {isGenerating ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-6 bg-muted animate-pulse rounded w-20" />
                      ))
                    ) : (
                      (aiAnalysis?.marketData?.trends || marketData.localMarket.trends).map((trend, index) => (
                        <Badge key={index} variant="secondary">{trend}</Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Market */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-500" />
                  Global Market
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Size</p>
                    <p className="text-2xl font-bold">{marketData.globalMarket.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-2xl font-bold text-green-500">
                        +{marketData.globalMarket.growth}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Competitors</p>
                    <p className="text-xl font-semibold">{marketData.globalMarket.competition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                    <p className="text-xl font-semibold">₹{marketData.globalMarket.avgPrice}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Global Trends</p>
                  <div className="flex flex-wrap gap-2">
                    {marketData.globalMarket.trends.map((trend, index) => (
                      <Badge key={index} variant="outline">{trend}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Analysis */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
                Pricing Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your Average Price</p>
                  <p className="text-3xl font-bold text-primary">₹{marketData.pricing.yourAvg}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Market Average</p>
                  <p className="text-3xl font-bold">₹{marketData.pricing.marketAvg}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">AI Recommended</p>
                  <p className="text-3xl font-bold text-green-500">₹{marketData.pricing.recommended}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Pricing Factors</h4>
                <div className="space-y-2">
                  {marketData.pricing.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors */}
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAnalysis.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{competitor.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(competitor.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm">{competitor.rating}</span>
                        </div>
                        <Badge variant="outline">₹{competitor.price}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Strengths</p>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Weaknesses</p>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(aiAnalysis?.recommendations || recommendations).map((rec: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">
                          {typeof rec === 'string' ? rec : rec.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {typeof rec === 'string' ? '' : rec.description}
                        </p>
                      </div>
                      {typeof rec === 'object' && rec.impact && (
                        <div className="flex space-x-2 ml-4">
                          <Badge className={getImpactColor(rec.impact)}>
                            Impact: {rec.impact}
                          </Badge>
                          <Badge className={getEffortColor(rec.effort)}>
                            Effort: {rec.effort}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Target className="w-4 h-4 mr-2" />
                        Implement
                      </Button>
                      <Button size="sm" variant="ghost">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="w-6 h-6 mb-2" />
                  Adjust Pricing
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Target New Audience
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  Analyze Trends
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Globe className="w-6 h-6 mb-2" />
                  Expand Market
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
