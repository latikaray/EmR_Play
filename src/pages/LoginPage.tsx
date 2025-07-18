import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Heart, Star, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    
    // Let the App.tsx routing handle navigation based on role
    // No manual navigation needed here
    
    setLoading(false);
  };

  const handleDemoMode = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 h-6 w-6 text-fun-yellow animate-float" />
        <Heart className="absolute top-32 right-32 h-5 w-5 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-40 left-40 h-4 w-4 text-accent animate-float" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-20 right-20 h-7 w-7 text-fun-teal animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-fun animate-bounce-in">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              EMR Play
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-comic">
            Welcome back to your emotional adventure! 🌟
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-comic text-foreground">
              Sign In
            </CardTitle>
            <CardDescription className="font-comic">
              Continue your emotional learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-comic text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 font-comic"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-comic text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10 font-comic"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  to="/forgot-password" 
                  className="text-primary hover:underline font-comic"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="fun" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In & Play! 🚀"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Mode */}
        <Card className="shadow-card bg-card/50 backdrop-blur border border-accent/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground font-comic mb-3">
              Want to try EMR Play first?
            </p>
            <Button 
              variant="outline" 
              onClick={handleDemoMode}
              className="w-full font-comic"
            >
              Try Demo Mode
            </Button>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-comic">
            New to EMR Play?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:underline font-bold"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Supabase Notice */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-fun">
          <CardContent className="p-4 text-center">
            <h4 className="font-bold font-comic mb-2">🔒 Secure & Safe</h4>
            <p className="text-sm opacity-90 font-comic">
              Your child's data is protected with enterprise-grade security. 
              We never share personal information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;