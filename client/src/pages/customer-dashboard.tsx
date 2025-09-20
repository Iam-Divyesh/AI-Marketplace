import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  Star, 
  Search,
  Filter,
  Eye,
  ShoppingBag,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Settings,
  History,
  Gift
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import ProductCard from '@/components/product-card';
import { ModelViewer } from '@/components/3d-model-viewer';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Handcrafted Pottery Bowl',
      artisan: 'Maya Sharma',
      amount: 2500,
      status: 'delivered',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    },
    {
      id: 'ORD-002',
      product: 'Wooden Sculpture',
      artisan: 'Raj Patel',
      amount: 4500,
      status: 'shipped',
      date: '2024-01-14',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    },
    {
      id: 'ORD-003',
      product: 'Ceramic Vase',
      artisan: 'Priya Singh',
      amount: 3200,
      status: 'processing',
      date: '2024-01-13',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    }
  ];

  const wishlist = [
    {
      id: '1',
      name: 'Handwoven Textile Art',
      artisan: 'Anita Kumar',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      model3d: null
    },
    {
      id: '2',
      name: 'Glass Ornament Set',
      artisan: 'Vikram Mehta',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      model3d: 'claypot.glb'
    }
  ];

  const cartItems = [
    {
      id: '1',
      name: 'Handcrafted Pottery Bowl',
      artisan: 'Maya Sharma',
      price: 2500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Wooden Sculpture',
      artisan: 'Raj Patel',
      price: 4500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
    }
  ];

  const recommendedProducts = [
    {
      id: '1',
      name: 'Handwoven Textile Art',
      artisan: 'Anita Kumar',
      price: 1800,
      category: 'Textiles',
      location: 'Jaipur, India',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      model3d: null,
      isFeatured: true,
      views: 120,
      likes: 45
    },
    {
      id: '2',
      name: 'Glass Ornament Set',
      artisan: 'Vikram Mehta',
      price: 2200,
      category: 'Glass Art',
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      model3d: 'necklace.glb',
      isFeatured: false,
      views: 89,
      likes: 32
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                Welcome back, {user?.firstName || 'Customer'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover unique handcrafted treasures and manage your orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{recentOrders.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold">{wishlist.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold">{cartItems.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">₹{recentOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{order.product}</h4>
                          <p className="text-sm text-muted-foreground">by {order.artisan}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wishlist Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wishlist.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price.toLocaleString()}</p>
                          <Button size="sm" variant="outline" className="mt-1">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        {product.model3d && (
                          <Badge className="absolute top-2 left-2 bg-blue-500/20 text-blue-500 border-blue-500/30">
                            3D View
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {product.artisan}</p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold">₹{product.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.5</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.image}
                            alt={order.product}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-medium">{order.product}</h4>
                            <p className="text-sm text-muted-foreground">by {order.artisan}</p>
                            <p className="text-xs text-muted-foreground">Order #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Package className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="relative mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {item.model3d && (
                          <Badge className="absolute top-2 left-2 bg-blue-500/20 text-blue-500 border-blue-500/30">
                            3D View
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <h4 className="font-medium mb-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {item.artisan}</p>
                      <p className="font-bold mb-3">₹{item.price.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">-</Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button size="sm" variant="outline">+</Button>
                        </div>
                        <p className="font-bold w-20 text-right">₹{item.price.toLocaleString()}</p>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">
                        Total: ₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                      </p>
                    </div>
                    <Button size="lg" className="px-8">
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <Input defaultValue={`${user?.firstName} ${user?.lastName}`} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input defaultValue={user?.email} type="email" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input defaultValue={user?.phone || ''} type="tel" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Address Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Street Address</label>
                          <Input placeholder="123 Main Street" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">City</label>
                            <Input placeholder="New York" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">ZIP Code</label>
                            <Input placeholder="10001" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Country</label>
                          <Input placeholder="United States" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5" />
                          <div>
                            <p className="font-medium">**** **** **** 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                      <Button variant="outline" className="w-full">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add New Payment Method
                      </Button>
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
