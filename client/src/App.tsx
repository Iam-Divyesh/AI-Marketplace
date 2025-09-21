import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/auth-context";
import { CartProvider } from "./contexts/cart-context";
import { WishlistProvider } from "./contexts/wishlist-context";
import Navigation from "./components/layout/navigation";
import Footer from "./components/layout/footer";
import AIChatWidget from "./components/ai-chat-widget";
import Home from "./pages/home";
import Marketplace from "./pages/marketplace";
import Dashboard from "./pages/dashboard";
import CustomerDashboard from "./pages/customer-dashboard";
import ArtisanDashboard from "./pages/artisan-dashboard";
import AuthPage from "./pages/auth";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/artisan-dashboard" component={ArtisanDashboard} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <TooltipProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <Router />
                <Footer />
                <AIChatWidget />
              </div>
              <Toaster />
              </TooltipProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
