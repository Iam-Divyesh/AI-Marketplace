import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThreeDIllustration from "./three-d-illustration";
import { Search, Plus } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16" data-testid="hero-section">
      <div className="hero-glow absolute inset-0 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-mono font-bold mb-6"
              data-testid="text-hero-title"
            >
              <span className="gradient-text">
                AI-Powered
              </span>
              <br />
              Artisan Marketplace
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
              data-testid="text-hero-description"
            >
              Discover unique handcrafted treasures from local artisans worldwide. 
              Let our AI assistant help you find the perfect piece for your collection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="gradient-bg hover:scale-105 transition-transform shadow-lg hover:shadow-primary/25"
                data-testid="button-explore-products"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Products
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="neon-border bg-card text-foreground hover:scale-105 transition-transform"
                data-testid="button-sell-artisan"
              >
                <Plus className="mr-2 h-5 w-5" />
                Sell as Artisan
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center"
          >
            <ThreeDIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
