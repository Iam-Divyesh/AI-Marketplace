import { useAuth } from "@/contexts/auth-context";
import ArtisanDashboard from "./artisan-dashboard";
import CustomerDashboard from "./customer-dashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
  return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user type
  if (user.userType === 'artisan') {
    return <ArtisanDashboard />;
  } else {
    return <CustomerDashboard />;
  }
}
