import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, Heart, Download, Calendar, Filter, Package } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', sales: 12, revenue: 24000, views: 1200, orders: 15, returns: 2 },
  { month: 'Feb', sales: 19, revenue: 38000, views: 1500, orders: 22, returns: 1 },
  { month: 'Mar', sales: 15, revenue: 30000, views: 1800, orders: 18, returns: 3 },
  { month: 'Apr', sales: 22, revenue: 44000, views: 2100, orders: 25, returns: 2 },
  { month: 'May', sales: 28, revenue: 56000, views: 2400, orders: 32, returns: 4 },
  { month: 'Jun', sales: 32, revenue: 64000, views: 2800, orders: 38, returns: 3 },
  { month: 'Jul', sales: 35, revenue: 70000, views: 3200, orders: 42, returns: 5 },
  { month: 'Aug', sales: 30, revenue: 60000, views: 2900, orders: 36, returns: 2 },
  { month: 'Sep', sales: 38, revenue: 76000, views: 3500, orders: 45, returns: 4 },
  { month: 'Oct', sales: 42, revenue: 84000, views: 3800, orders: 50, returns: 6 },
  { month: 'Nov', sales: 45, revenue: 90000, views: 4200, orders: 55, returns: 3 },
  { month: 'Dec', sales: 48, revenue: 96000, views: 4500, orders: 60, returns: 7 },
];

const yearlyData = [
  { year: '2021', sales: 180, revenue: 360000, views: 18000, orders: 220, returns: 25 },
  { year: '2022', sales: 240, revenue: 480000, views: 24000, orders: 290, returns: 30 },
  { year: '2023', sales: 320, revenue: 640000, views: 32000, orders: 380, returns: 35 },
  { year: '2024', sales: 280, revenue: 560000, views: 28000, orders: 340, returns: 28 },
];

// Product performance data will be fetched from API
const productPerformance = [];

// Category data will be calculated from actual products
const categoryData = [];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function AnalyticsChart() {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('Dec');

  const currentData = timePeriod === 'monthly' ? monthlyData : yearlyData;
  const currentYearData = monthlyData.filter(item => item.month === selectedMonth);
  
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
  const totalViews = currentData.reduce((sum, item) => sum + item.views, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
  const totalReturns = currentData.reduce((sum, item) => sum + item.returns, 0);

  const previousPeriodData = timePeriod === 'monthly' 
    ? monthlyData.slice(-2, -1)[0] 
    : yearlyData.slice(-2, -1)[0];

  const revenueGrowth = previousPeriodData 
    ? ((totalRevenue - previousPeriodData.revenue) / previousPeriodData.revenue * 100)
    : 0;

  const salesGrowth = previousPeriodData 
    ? ((totalSales - previousPeriodData.sales) / previousPeriodData.sales * 100)
    : 0;

  const viewsGrowth = previousPeriodData 
    ? ((totalViews - previousPeriodData.views) / previousPeriodData.views * 100)
    : 0;

  const returnRate = totalOrders > 0 ? (totalReturns / totalOrders * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Analytics Period:</span>
              </div>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              {timePeriod === 'monthly' && (
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthlyData.map(month => (
                      <SelectItem key={month.month} value={month.month}>
                        {month.month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className={`flex items-center mt-2 text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(revenueGrowth).toFixed(1)}% from last {timePeriod === 'monthly' ? 'month' : 'year'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
            <div className={`flex items-center mt-2 text-sm ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {salesGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(salesGrowth).toFixed(1)}% from last {timePeriod === 'monthly' ? 'month' : 'year'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <div className={`flex items-center mt-2 text-sm ${viewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {viewsGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(viewsGrowth).toFixed(1)}% from last {timePeriod === 'monthly' ? 'month' : 'year'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              {totalReturns} returns ({returnRate.toFixed(1)}% rate)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +0.2 from last {timePeriod === 'monthly' ? 'month' : 'year'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timePeriod === 'monthly' ? 'month' : 'year'} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Sales'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="2" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Sales'
                    ]}
                  />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productPerformance.map((product) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(product.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">{product.sales} sales</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${category.value}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {category.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views vs Sales Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timePeriod === 'monthly' ? 'month' : 'year'} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
