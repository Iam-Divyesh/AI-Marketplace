import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, rotateX: 5 }}
      className="transform-gpu"
      data-testid={`card-product-${product.id}`}
    >
      <Card className="product-card glass-effect hover:neon-border group cursor-pointer">
        <CardContent className="p-6">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`img-product-${product.id}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-2">
            <h3 
              className="text-lg font-semibold line-clamp-1" 
              data-testid={`text-product-name-${product.id}`}
            >
              {product.name}
            </h3>
            
            <p 
              className="text-muted-foreground text-sm" 
              data-testid={`text-product-artisan-${product.id}`}
            >
              by {product.artisanName}
            </p>
            
            <p 
              className="text-accent font-bold text-lg" 
              data-testid={`text-product-price-${product.id}`}
            >
              ₹{parseFloat(product.price).toLocaleString()}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="bg-primary/20 text-primary border-primary/30"
                data-testid={`text-product-category-${product.id}`}
              >
                {product.category}
              </Badge>
              
              <span 
                className="text-xs text-muted-foreground"
                data-testid={`text-product-location-${product.id}`}
              >
                {product.location}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
