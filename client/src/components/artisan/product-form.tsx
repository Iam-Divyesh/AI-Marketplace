import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }).optional(),
  location: z.string().min(1, 'Location is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  // Cost tracking fields
  materialCost: z.string().optional(),
  laborCost: z.string().optional(),
  overheadCost: z.string().optional(),
  totalCost: z.string().optional(),
  profitMargin: z.string().optional(),
  // Additional fields
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  processingTime: z.string().optional(),
  careInstructions: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [model3d, setModel3d] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuth();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: '',
      location: '',
      stock: 1,
      materials: [],
      tags: [],
      materialCost: '',
      laborCost: '',
      overheadCost: '',
      totalCost: '',
      profitMargin: '',
      isActive: true,
      isFeatured: false,
      processingTime: '',
      careInstructions: '',
    },
  });

  const categories = [
    'Jewelry', 'Pottery', 'Textiles', 'Woodwork', 'Glass Art', 'Leather',
    'Metalwork', 'Paper Crafts', 'Basketry', 'Ceramics', 'Sculpture'
  ];

  const materials = [
    'Clay', 'Wood', 'Metal', 'Fabric', 'Glass', 'Leather', 'Stone',
    'Bamboo', 'Ceramic', 'Paper', 'Wool', 'Silk', 'Cotton'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImages]);
        setIsUploading(false);
        toast({
          title: 'Images uploaded',
          description: `${files.length} image(s) uploaded successfully`,
        });
      }, 1000);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setModel3d(URL.createObjectURL(file));
        setIsUploading(false);
        toast({
          title: '3D Model uploaded',
          description: '3D model uploaded successfully',
        });
      }, 2000);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to add products.',
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      
      // Calculate total cost and profit margin
      const materialCost = parseFloat(data.materialCost || '0');
      const laborCost = parseFloat(data.laborCost || '0');
      const overheadCost = parseFloat(data.overheadCost || '0');
      const totalCost = materialCost + laborCost + overheadCost;
      const price = parseFloat(data.price);
      const profitMargin = totalCost > 0 ? ((price - totalCost) / price) * 100 : 0;

      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || null,
        price: price.toString(),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice).toString() : null,
        images: images,
        model3d: model3d || null,
        artisanId: user?.id || '',
        artisanName: user?.artisanName || user?.firstName || 'Unknown Artisan',
        location: data.location,
        stock: data.stock,
        weight: data.weight ? parseFloat(data.weight).toString() : null,
        dimensions: data.dimensions ? {
          length: data.dimensions.length ? parseFloat(data.dimensions.length).toString() : null,
          width: data.dimensions.width ? parseFloat(data.dimensions.width).toString() : null,
          height: data.dimensions.height ? parseFloat(data.dimensions.height).toString() : null,
        } : null,
        materials: data.materials || [],
        tags: data.tags || [],
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        materialCost: materialCost.toString(),
        laborCost: laborCost.toString(),
        overheadCost: overheadCost.toString(),
        totalCost: totalCost.toString(),
        profitMargin: profitMargin.toString(),
        processingTime: data.processingTime || null,
        careInstructions: data.careInstructions || null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Product created',
          description: 'Your product has been added successfully',
        });
        form.reset();
        setImages([]);
        setModel3d('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product in detail..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium">Product Images *</label>
                <div className="mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  {isUploading && (
                    <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                  )}
                </div>
              </div>

              {/* 3D Model Upload */}
              <div>
                <label className="text-sm font-medium">3D Model (Optional)</label>
                <div className="mt-2">
                  {model3d ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 p-2 border rounded-lg">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">3D Model uploaded</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setModel3d('')}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
                        <span className="text-sm text-muted-foreground mt-1">Upload .glb file</span>
                      </div>
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={handleModelUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Cost Tracking Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cost Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="materialCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laborCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Labor Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overheadCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overhead Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profitMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Margin (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="processingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Time</FormLabel>
                        <FormControl>
                          <Input placeholder="3-5 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                
                <FormField
                  control={form.control}
                  name="careInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How to care for this product..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (grams)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Active (visible to customers)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Featured Product</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="text-sm font-medium">Materials Used</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {materials.map((material) => (
                    <Badge
                      key={material}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
