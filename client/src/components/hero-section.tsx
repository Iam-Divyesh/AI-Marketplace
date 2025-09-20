import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThreeDIllustration from "./three-d-illustration";
import { Search, Plus, Star, Users, Globe, Shield, Zap, Heart } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-6"
              >
                <Badge variant="secondary" className="mb-4">
                  <Zap className="w-3 h-3 mr-1" />
                  AI-Powered Platform
                </Badge>
              </motion.div>

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
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="gradient-bg hover:scale-105 transition-transform shadow-lg hover:shadow-primary/25"
                    data-testid="button-explore-products"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Explore Products
                  </Button>
                </Link>
                
                <Link href={user ? "/dashboard" : "/auth"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="neon-border bg-card text-foreground hover:scale-105 transition-transform"
                    data-testid="button-sell-artisan"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Sell as Artisan
                  </Button>
                </Link>
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

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine traditional craftsmanship with cutting-edge technology to create the ultimate marketplace experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered Search",
                description: "Find exactly what you're looking for with our intelligent recommendation system."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Marketplace",
                description: "Connect with artisans from around the world and discover unique cultural pieces."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Transactions",
                description: "Shop with confidence using our secure payment system and buyer protection."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Support Artisans",
                description: "Directly support local artisans and help preserve traditional craftsmanship."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Artisans", icon: <Users className="w-6 h-6" /> },
              { number: "50,000+", label: "Products Listed", icon: <Star className="w-6 h-6" /> },
              { number: "100+", label: "Countries", icon: <Globe className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2 gradient-text">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
