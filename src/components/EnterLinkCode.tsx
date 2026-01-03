import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link2, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const EnterLinkCode = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [linked, setLinked] = useState(false);

  const handleLinkAccount = async () => {
    if (!user || !code.trim()) return;

    const formattedCode = code.trim().toUpperCase();
    
    if (formattedCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-character link code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Find the pending link with this code
    const { data: link, error: findError } = await supabase
      .from('parent_child_links')
      .select('*')
      .eq('link_code', formattedCode)
      .eq('status', 'pending')
      .maybeSingle();

    if (findError || !link) {
      toast({
        title: "Invalid Code",
        description: "This code is invalid or has already been used.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Update the link with child's user id
    const { error: updateError } = await supabase
      .from('parent_child_links')
      .update({
        child_user_id: user.id,
        status: 'linked',
        linked_at: new Date().toISOString()
      })
      .eq('id', link.id);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to link account. Please try again.",
        variant: "destructive"
      });
    } else {
      setLinked(true);
      toast({
        title: "Account Linked! 🎉",
        description: "Your account is now linked with your parent."
      });
    }

    setLoading(false);
  };

  if (linked) {
    return (
      <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-green-500/30">
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-comic font-bold text-foreground mb-2">
            Successfully Linked!
          </h3>
          <p className="text-muted-foreground font-comic">
            Your parent can now see your progress and activities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="font-comic flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Link to Parent Account
        </CardTitle>
        <CardDescription className="font-comic">
          Enter the code your parent gave you to link your accounts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            maxLength={6}
            className="font-mono text-2xl text-center tracking-widest uppercase"
          />
          <p className="text-xs text-muted-foreground font-comic text-center">
            Ask your parent for the 6-character link code
          </p>
        </div>
        
        <Button
          onClick={handleLinkAccount}
          disabled={loading || code.length !== 6}
          variant="fun"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Link2 className="h-4 w-4 mr-2" />
          )}
          Link Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnterLinkCode;