import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'child' | 'parent';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string, expectedRole: UserRole) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, role: UserRole, displayName?: string, otpEmail?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role:', error);
        return null;
      }

      return data?.role as UserRole | null;
    } catch (error) {
      console.error('Error fetching role:', error);
      return null;
    }
  };

  const fetchUserProfile = async (userId: string, userRole: UserRole | null) => {
    try {
      if (!userRole) {
        setProfile(null);
        return;
      }

      const tableName = userRole === 'parent' ? 'parent_profiles' : 'child_profiles';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userRole = await fetchUserRole(user.id);
      setRole(userRole);
      await fetchUserProfile(user.id, userRole);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role and profile after setting user
          setTimeout(async () => {
            const userRole = await fetchUserRole(session.user.id);
            setRole(userRole);
            await fetchUserProfile(session.user.id, userRole);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
        await fetchUserProfile(session.user.id, userRole);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, expectedRole: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Check if user has the expected role
      if (data.user) {
        const userRole = await fetchUserRole(data.user.id);
        
        if (userRole !== expectedRole) {
          // Sign out the user - wrong login page
          await supabase.auth.signOut();
          toast({
            title: "Wrong Account Type",
            description: `This is a ${userRole} account. Please use the ${userRole} login page.`,
            variant: "destructive",
          });
          return { error: { message: 'Wrong account type' } };
        }

        setRole(userRole);
        await fetchUserProfile(data.user.id, userRole);
        
        toast({
          title: "Welcome back! 🎉",
          description: "Successfully signed in!",
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, displayName?: string, otpEmail?: string) => {
    try {
      // For child accounts, use parent's email; for parent accounts, use their own email
      const emailForOTP = otpEmail || email;
      
      // Use signUp with email confirmation to get OTP code
      const { data, error } = await supabase.auth.signUp({
        email: emailForOTP,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            actual_email: email, // Store actual user email in metadata
            role: role,
            display_name: displayName || null
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Verification Code Sent! 📧",
        description: `Check ${emailForOTP} for your 6-digit code.`,
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
      setRole(null);
      toast({
        title: "See you later! 👋",
        description: "Successfully signed out.",
      });
    }
  };

  const deleteAccount = async () => {
    try {
      // First delete all user data using the database function
      const { error: deleteError } = await supabase.rpc('delete_user_account');
      
      if (deleteError) {
        console.error('Error deleting user data:', deleteError);
        toast({
          title: "Error",
          description: "Failed to delete account data. Please try again.",
          variant: "destructive",
        });
        return { error: deleteError };
      }
      
      // Then sign out the user
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    deleteAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};