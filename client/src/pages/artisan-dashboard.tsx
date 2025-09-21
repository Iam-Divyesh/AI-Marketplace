import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Star,
  MessageCircle,
  Globe,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ProductForm } from '@/components/artisan/product-form';
import { ProductManagement } from '@/components/artisan/product-management';
import { AnalyticsChart } from '@/components/artisan/analytics-chart';
import { OrdersTable } from '@/components/artisan/orders-table';
import { MarketAnalysis } from '@/components/artisan/market-analysis';
import { api } from '@/lib/api';

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch stats from API
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/artisan/stats', { artisan: user?.id }],
    queryFn: () => api.getArtisanStats({ artisan: user?.id }),
  });

  const stats = statsData || {
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalViews: 0,
    avgRating: 0,
    pendingOrders: 0,
    thisMonthRevenue: 0,
    thisMonthSales: 0
  };

  // Fetch recent orders from API
  const { data: recentOrdersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/orders', { artisan: user?.id, limit: 3 }],
    queryFn: () => api.getOrders({ artisan: user?.id, limit: 3 }),
  });

  const recentOrders = recentOrdersData?.orders || [];

  // Fetch top products from API
  const { data: topProductsData, isLoading: isLoadingTopProducts } = useQuery({
    queryKey: ['/api/products', { artisan: user?.id, sortBy: 'sales', limit: 4 }],
    queryFn: () => api.getProducts({ artisan: user?.id, sortBy: 'sales', limit: 4 }),
  });

  const topProducts = topProductsData?.products || [];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back, {user?.firstName || 'Artisan'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your products, track sales, and grow your business
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{stats.totalSales}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15% from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">{(stats.totalViews || 0).toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +22% from last month
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(order.amount || 0).toLocaleString()}</p>
                          <Badge 
                            variant={order.status === 'delivered' ? 'default' : 
                                   order.status === 'shipped' ? 'secondary' : 'outline'}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Top Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{product.sales} sales</span>
                            <span>{product.views} views</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(product.revenue || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Plus className="w-6 h-6 mb-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageCircle className="w-6 h-6 mb-2" />
                    Customer Messages
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Tabs defaultValue="management" className="space-y-4">
              <TabsList>
                <TabsTrigger value="management">Manage Products</TabsTrigger>
                <TabsTrigger value="add">Add Product</TabsTrigger>
              </TabsList>
              <TabsContent value="management">
                <ProductManagement />
              </TabsContent>
              <TabsContent value="add">
                <ProductForm />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersTable />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsChart />
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market">
            <MarketAnalysis />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Business Name</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue={user?.businessName || ''}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue={user?.location || ''}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Email notifications for new orders
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Weekly sales reports
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Marketing updates
                      </label>
                    </div>
                  </div>

                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
