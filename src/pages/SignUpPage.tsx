import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Heart, Star, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    parentEmail: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    // Parent email is required for child accounts
    if (!formData.parentEmail) {
      toast.error("Parent's email is required");
      return;
    }
    
    setLoading(true);
    
    // Use parent's email for verification
    const emailToVerify = formData.parentEmail;
    
    const { error } = await signUp(
      formData.email, 
      formData.password, 
      'child', 
      formData.name,
      emailToVerify
    );
    
    if (!error) {
      // Navigate to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(emailToVerify)}&role=child&name=${encodeURIComponent(formData.name)}`);
    }
    
    setLoading(false);
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
            Start your emotional adventure today! 🌟
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-comic text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="font-comic">
              Join thousands of kids learning about emotions!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-comic text-foreground">
                  Child's Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="child@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 font-comic"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail" className="font-comic text-foreground">
                  Parent's Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parentEmail"
                    type="email"
                    placeholder="parent@email.com"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                    className="pl-10 font-comic"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground font-comic">
                  The verification code will be sent to parent's email
                </p>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-comic text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10 pr-10 font-comic"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <p className="text-sm text-destructive font-comic">Passwords don't match</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="fun" 
                size="lg" 
                className="w-full"
                disabled={loading || formData.password !== formData.confirmPassword || !formData.parentEmail}
              >
                {loading ? "Sending Verification Code..." : "Continue to Verification 🚀"}
              </Button>
            </form>
          </CardContent>
        </Card>


        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-comic">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-primary hover:underline font-bold"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-fun">
          <CardContent className="p-4 text-center">
            <h4 className="font-bold font-comic mb-2">🔒 Safe & Secure</h4>
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

export default SignUpPage;