import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Sparkles, Heart, Star, Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "";
  const displayName = searchParams.get("name") || "";

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        // Small delay to ensure auth.users entry is fully committed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create or update profile after successful verification
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            role: role as 'child' | 'parent',
            display_name: displayName || null
          }, { onConflict: 'user_id' });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error("Failed to create profile. Please try logging in.");
        } else {
          toast.success("Account verified successfully! 🎉");
        }

        // Navigate based on intended role
        navigate(role === 'parent' ? '/parent' : '/child');
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("A new code has been sent to your email! 📧");
      }
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
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
            Almost there! Let's verify your email 🔐
          </p>
        </div>

        {/* OTP Verification Form */}
        <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-comic text-foreground">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="font-comic">
              We sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                type="submit" 
                variant="fun" 
                size="lg" 
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Start Playing! 🚀"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-comic">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="font-comic"
                >
                  {resending ? "Sending..." : "Resend Code 📧"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Sign Up */}
        <div className="text-center">
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-comic"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Link>
        </div>

        {/* Help Notice */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-fun">
          <CardContent className="p-4 text-center">
            <h4 className="font-bold font-comic mb-2">💡 Pro Tip</h4>
            <p className="text-sm opacity-90 font-comic">
              Check your spam folder if you don't see the email. 
              The code expires after 1 hour for security.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
