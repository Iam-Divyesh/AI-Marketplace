import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { api } from "@/lib/api";
import type { ProductQuery } from "@shared/schema";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [filters, setFilters] = useState<ProductQuery>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch || undefined }));
  }, [debouncedSearch]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/products", filters],
    queryFn: () => api.getProducts(filters),
  });

  const handleFilterChange = (key: keyof ProductQuery, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const categories = [
    "All Categories",
    "Jewelry",
    "Pottery", 
    "Textiles",
    "Woodwork",
    "Glass Art",
    "Leather"
  ];

  const locations = [
    "All Locations",
    "India",
    "USA",
    "Spain",
    "Europe"
  ];

  const priceRanges = [
    { label: "All Prices", min: undefined, max: undefined },
    { label: "Under ₹500", min: undefined, max: 500 },
    { label: "₹500 - ₹2000", min: 500, max: 2000 },
    { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
    { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
    { label: "Above ₹10000", min: 10000, max: undefined },
  ];

  const sortOptions = [
    { label: "Newest First", value: "createdAt", order: "desc" },
    { label: "Oldest First", value: "createdAt", order: "asc" },
    { label: "Price: Low to High", value: "price", order: "asc" },
    { label: "Price: High to Low", value: "price", order: "desc" },
    { label: "Most Popular", value: "views", order: "desc" },
    { label: "Most Liked", value: "likes", order: "desc" },
  ];

  const materials = [
    "All Materials",
    "Clay",
    "Wood",
    "Metal",
    "Glass",
    "Fabric",
    "Leather",
    "Stone",
    "Ceramic",
    "Bamboo",
    "Paper"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16"
      data-testid="page-marketplace"
    >
      <div className="py-20 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-mono font-bold mb-4"
              data-testid="text-marketplace-title"
            >
              <span className="gradient-text">Artisan Marketplace</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
              data-testid="text-marketplace-description"
            >
              Discover unique handcrafted items from talented artisans
            </motion.p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 glass-effect">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, artisans, or categories..."
                      className="pl-10 bg-input border-border focus:ring-primary"
                      data-testid="input-search-products"
                    />
                  </div>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => 
                      handleFilterChange("category", value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem 
                          key={category} 
                          value={category === "All Categories" ? "all" : category}
                          data-testid={`option-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select
                    value={filters.location || "all"}
                    onValueChange={(value) => 
                      handleFilterChange("location", value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger data-testid="select-location">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem 
                          key={location} 
                          value={location === "All Locations" ? "all" : location}
                          data-testid={`option-location-${location.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <Select
                    value={`${filters.minPrice || "all"}-${filters.maxPrice || "all"}`}
                    onValueChange={(value) => {
                      const [min, max] = value.split("-");
                      handleFilterChange("minPrice", min === "all" ? undefined : Number(min));
                      handleFilterChange("maxPrice", max === "all" ? undefined : Number(max));
                    }}
                  >
                    <SelectTrigger data-testid="select-price-range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem 
                          key={range.label} 
                          value={`${range.min || "all"}-${range.max || "all"}`}
                          data-testid={`option-price-${range.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">Materials</label>
                  <Select
                    value={filters.materials?.[0] || "all"}
                    onValueChange={(value) => 
                      handleFilterChange("materials", value === "all" ? undefined : [value])
                    }
                  >
                    <SelectTrigger data-testid="select-materials">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem 
                          key={material} 
                          value={material === "All Materials" ? "all" : material}
                          data-testid={`option-material-${material.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select
                    value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split("-");
                      handleFilterChange("sortBy", sortBy as any);
                      handleFilterChange("sortOrder", sortOrder as any);
                    }}
                  >
                    <SelectTrigger data-testid="select-sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem 
                          key={option.label} 
                          value={`${option.value}-${option.order}`}
                          data-testid={`option-sort-${option.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="min-w-[100px]"
                  data-testid="button-clear-filters"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results Count */}
          {data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-muted-foreground" data-testid="text-results-count">
                {data.total} {data.total === 1 ? "product" : "products"} found
              </p>
            </motion.div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-loading">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center" data-testid="products-error">
              <p className="text-destructive mb-4">Failed to load products</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </Card>
          ) : data?.products.length === 0 ? (
            <Card className="p-8 text-center" data-testid="products-empty">
              <p className="text-muted-foreground mb-4">No products found matching your criteria</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="products-grid"
            >
              {data?.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
