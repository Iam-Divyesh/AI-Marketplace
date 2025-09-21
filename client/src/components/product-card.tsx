import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useState } from "react";
import { ModelViewer } from "./3d-model-viewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { Inline3DViewer } from './inline-3d-viewer';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const isInCart = items.some(item => item.id === product.id);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        artisan: product.artisanName,
        price: parseFloat(product.price),
        image: Array.isArray(product.images) ? product.images[0] : product.images,
        category: product.category,
        location: product.location,
        model3d: product.model3d,
        isFeatured: product.isFeatured,
        views: product.views,
        likes: product.likes
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      artisan: product.artisanName,
      price: parseFloat(product.price),
      image: Array.isArray(product.images) ? product.images[0] : product.images
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
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
        <Card className="product-card glass-effect hover:neon-border group cursor-pointer" onClick={() => setShowProductModal(true)}>
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
                  onClick={handleWishlist}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
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
              <div className="flex space-x-2 pt-2 items-center">
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
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
                {/* Add the 3D viewer beside the buttons */}
                <Inline3DViewer modelUrl="/claypot.glb" className="ml-2" />
              </div>
               
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Product Detail Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">₹{parseFloat(product.price).toLocaleString()}</p>
                  {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                    <p className="text-sm text-muted-foreground line-through">
                      ₹{parseFloat(product.originalPrice).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5 (24 reviews)</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Artisan</h3>
                <p className="text-muted-foreground">{product.artisanName} • {product.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Category</h3>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              {product.materials && product.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <Badge key={index} variant="secondary">{material}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex space-x-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
