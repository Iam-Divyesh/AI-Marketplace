import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Plus, Edit, Trash2, Package } from "lucide-react";

export default function Dashboard() {
  const [selectedArtisanId] = useState("user1"); // Mock current user ID
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Pottery",
      price: "0",
      image: "",
      artisanName: "Maya Sharma", // Mock current user name
      artisanId: selectedArtisanId,
      location: "",
    },
  });

  // Fetch artisan's products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["/api/artisan", selectedArtisanId, "products"],
    queryFn: () => api.getProducts({ search: "Maya Sharma" }), // Mock query by artisan name
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (product: InsertProduct) => api.createProduct(product),
    onSuccess: (data) => {
      toast({
        title: "Product Created",
        description: `${data.product.name} has been added to your collection.`,
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["/api/artisan", selectedArtisanId, "products"]
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => api.deleteProduct(productId),
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been removed from your collection.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/artisan", selectedArtisanId, "products"]
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    createProductMutation.mutate(data);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const categories = [
    "Jewelry",
    "Pottery",
    "Textiles", 
    "Woodwork",
    "Glass Art",
    "Leather"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16"
      data-testid="page-dashboard"
    >
      <div className="py-20 bg-gradient-to-b from-card/20 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-mono font-bold mb-4"
              data-testid="text-dashboard-title"
            >
              <span className="gradient-text">Artisan Dashboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
              data-testid="text-dashboard-description"
            >
              Share your creations with the world
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center" data-testid="text-form-title">
                    <Plus className="mr-2 h-5 w-5 text-primary" />
                    Add New Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-product-upload">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter product name"
                                className="bg-input border-border focus:ring-primary"
                                data-testid="input-product-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product"
                                className="bg-input border-border focus:ring-primary h-24"
                                data-testid="input-product-description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                className="bg-input border-border focus:ring-primary"
                                data-testid="input-product-image"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-product-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (₹)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000"
                                  className="bg-input border-border focus:ring-primary"
                                  data-testid="input-product-price"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City, Country"
                                className="bg-input border-border focus:ring-primary"
                                data-testid="input-product-location"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full gradient-bg hover:scale-105 transition-transform"
                        disabled={createProductMutation.isPending}
                        data-testid="button-submit-product"
                      >
                        {createProductMutation.isPending ? (
                          "Uploading..."
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Product
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Product Management */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center" data-testid="text-products-title">
                    <Package className="mr-2 h-5 w-5 text-accent" />
                    Your Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4" data-testid="products-list">
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-3 bg-card rounded-lg border border-border">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-8" />
                          </div>
                        </div>
                      ))
                    ) : productsData?.products.length === 0 ? (
                      <div className="text-center py-8" data-testid="products-empty-state">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No products yet</p>
                        <p className="text-sm text-muted-foreground">Start by adding your first creation!</p>
                      </div>
                    ) : (
                      productsData?.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-4 p-3 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                          data-testid={`product-item-${product.id}`}
                        >
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                data-testid={`img-product-thumbnail-${product.id}`}
                              />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 
                              className="font-medium line-clamp-1" 
                              data-testid={`text-product-title-${product.id}`}
                            >
                              {product.name}
                            </h4>
                            <p 
                              className="text-sm text-muted-foreground" 
                              data-testid={`text-product-price-${product.id}`}
                            >
                              ₹{parseFloat(product.price).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-accent hover:text-accent/80 hover:bg-accent/10"
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProductMutation.isPending}
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
