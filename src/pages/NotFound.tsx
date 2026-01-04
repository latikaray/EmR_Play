import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Heart, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const { role } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getHomeRoute = () => {
    if (role === 'parent') {
      return '/parent';
    } else if (role === 'child') {
      return '/child';
    }
    return '/';
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 h-6 w-6 text-fun-yellow animate-float" />
        <Heart className="absolute top-32 right-32 h-5 w-5 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-40 left-40 h-4 w-4 text-accent animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="max-w-md w-full shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-fun">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-6xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic mb-2">
            404
          </CardTitle>
          <h2 className="text-2xl font-comic text-foreground">
            Oops! Page Not Found
          </h2>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground font-comic">
            The page you're looking for seems to have wandered off on an adventure! 🌟
          </p>
          <p className="text-sm text-muted-foreground font-comic">
            Let's get you back to where the fun happens!
          </p>
          <Link to={getHomeRoute()}>
            <Button variant="fun" size="lg" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home 🏠
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
