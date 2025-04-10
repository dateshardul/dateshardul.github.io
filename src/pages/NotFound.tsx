
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-pms-teal/10 flex items-center justify-center text-pms-teal mx-auto">
          <span className="text-4xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold text-pms-blue">Page Not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. The page might have been removed, 
          renamed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-pms-teal hover:bg-pms-teal/90">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
