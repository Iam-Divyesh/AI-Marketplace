import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertCircle
} from 'lucide-react';

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
  const [selectedProduct, setSelectedProduct] = useState('all');

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

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time insights powered by Gemini AI and Google Studio
                </p>
              </div>
            </div>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate New Analysis
            </Button>
          </div>
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Size</p>
                    <p className="text-2xl font-bold">{marketData.localMarket.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-2xl font-bold text-green-500">
                        +{marketData.localMarket.growth}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Competitors</p>
                    <p className="text-xl font-semibold">{marketData.localMarket.competition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                    <p className="text-xl font-semibold">₹{marketData.localMarket.avgPrice}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Trending Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {marketData.localMarket.trends.map((trend, index) => (
                      <Badge key={index} variant="secondary">{trend}</Badge>
                    ))}
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
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Badge className={getImpactColor(rec.impact)}>
                          Impact: {rec.impact}
                        </Badge>
                        <Badge className={getEffortColor(rec.effort)}>
                          Effort: {rec.effort}
                        </Badge>
                      </div>
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
