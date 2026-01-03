import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link2, Copy, Check, RefreshCw, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface LinkedChild {
  id: string;
  child_user_id: string;
  status: string;
  linked_at: string | null;
  link_code: string;
  child_name?: string;
}

const LinkChildAccount = () => {
  const { user } = useAuth();
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLinkedChildren();
    }
  }, [user]);

  const fetchLinkedChildren = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('parent_child_links')
      .select('*')
      .eq('parent_user_id', user.id);

    if (error) {
      console.error('Error fetching linked children:', error);
      return;
    }

    // Fetch child names for linked accounts
    const childrenWithNames = await Promise.all(
      (data || []).map(async (link) => {
        if (link.child_user_id && link.status === 'linked') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', link.child_user_id)
            .maybeSingle();
          
          return {
            ...link,
            child_name: profile?.display_name || 'Unknown Child'
          };
        }
        return link;
      })
    );

    setLinkedChildren(childrenWithNames);
  };

  const generateLinkCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createLinkCode = async () => {
    if (!user) return;
    
    setLoading(true);
    const code = generateLinkCode();

    const { error } = await supabase
      .from('parent_child_links')
      .insert({
        parent_user_id: user.id,
        link_code: code,
        status: 'pending'
      });

    if (error) {
      if (error.code === '23505') {
        // Duplicate code, try again
        createLinkCode();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate link code. Please try again.",
        variant: "destructive"
      });
    } else {
      setLinkCode(code);
      fetchLinkedChildren();
      toast({
        title: "Link Code Generated!",
        description: "Share this code with your child to link accounts."
      });
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (linkCode) {
      await navigator.clipboard.writeText(linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Link code copied to clipboard."
      });
    }
  };

  const deletePendingLink = async (linkId: string) => {
    const { error } = await supabase
      .from('parent_child_links')
      .delete()
      .eq('id', linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove link. Please try again.",
        variant: "destructive"
      });
    } else {
      fetchLinkedChildren();
      setLinkCode(null);
      toast({
        title: "Link Removed",
        description: "The pending link has been removed."
      });
    }
  };

  const pendingLinks = linkedChildren.filter(c => c.status === 'pending');
  const activeLinks = linkedChildren.filter(c => c.status === 'linked');

  return (
    <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="font-comic flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Link Child's Account
        </CardTitle>
        <CardDescription className="font-comic">
          Generate a code for your child to link their account and view their progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generate New Code */}
        <div className="space-y-4">
          {!linkCode && pendingLinks.length === 0 && (
            <Button 
              onClick={createLinkCode} 
              disabled={loading}
              variant="fun"
              className="w-full"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              Generate Link Code
            </Button>
          )}

          {/* Show active link code */}
          {(linkCode || pendingLinks.length > 0) && (
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
              <p className="text-sm text-muted-foreground font-comic mb-2">
                Share this code with your child:
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={linkCode || pendingLinks[0]?.link_code || ''}
                  readOnly
                  className="font-mono text-2xl text-center tracking-widest font-bold"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-comic mt-2">
                Your child should enter this code in their profile settings.
              </p>
              {pendingLinks.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePendingLink(pendingLinks[0].id)}
                  className="mt-2 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel & Generate New Code
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Linked Children */}
        {activeLinks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-comic font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Linked Children ({activeLinks.length})
            </h4>
            <div className="space-y-2">
              {activeLinks.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                >
                  <div>
                    <p className="font-comic font-medium">{child.child_name}</p>
                    <p className="text-xs text-muted-foreground font-comic">
                      Linked {child.linked_at ? new Date(child.linked_at).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-comic">
                    Connected
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeLinks.length === 0 && pendingLinks.length === 0 && !linkCode && (
          <p className="text-sm text-muted-foreground font-comic text-center py-4">
            No linked children yet. Generate a code to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkChildAccount;