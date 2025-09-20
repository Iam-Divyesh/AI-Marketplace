import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useState } from "react";
import { ModelViewer } from "./3d-model-viewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInCart(!isInCart);
    // TODO: Implement add to cart functionality
  };

  const handleView3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShow3DViewer(true);
  };

  const productImages = Array.isArray(product.images) ? product.images : [product.image];
  const mainImage = productImages[0];

  return (
    <>
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
                src={mainImage}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                data-testid={`img-product-${product.id}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Action buttons overlay */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                {product.model3d && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handleView3D}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* 3D Model indicator */}
              {product.model3d && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                    3D View
                  </Badge>
                </div>
              )}

              {/* Featured badge */}
              {product.isFeatured && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
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
              
              <div className="flex items-center justify-between">
                <p 
                  className="text-accent font-bold text-lg" 
                  data-testid={`text-product-price-${product.id}`}
                >
                  ₹{parseFloat(product.price).toLocaleString()}
                </p>
                
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <p className="text-muted-foreground text-sm line-through">
                    ₹{parseFloat(product.originalPrice).toLocaleString()}
                  </p>
                )}
              </div>
              
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

              {/* Rating and views */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                  <span>({product.likes || 0})</span>
                </div>
                <span>{product.views || 0} views</span>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleAddToCart}
                  variant={isInCart ? "secondary" : "default"}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInCart ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Buy Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Model Viewer Dialog */}
      <Dialog open={show3DViewer} onOpenChange={setShow3DViewer}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{product.name} - 3D View</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6">
            <ModelViewer
              modelUrl={product.model3d || ''}
              fallbackImage={mainImage}
              productName={product.name}
              className="h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
