
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionInfo {
  id: string;
  subscribed: boolean;
  tier: 'free' | 'pro';
  expiresAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionInfo | null;
  isAuthenticated: boolean;
  isPro: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    firstName: string,
    lastName: string,
    dateOfBirth: Date
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account: bypasses the real backend entirely
export const DEMO_EMAIL = 'demo@demo.com';
export const DEMO_PASSWORD = 'demo@demo';
const DEMO_STORAGE_KEY = 'medisynic-demo-session';

const buildDemoSession = (): Session => {
  const demoUser = {
    id: '00000000-0000-4000-8000-000000000001',
    aud: 'authenticated',
    role: 'authenticated',
    email: DEMO_EMAIL,
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: { provider: 'demo' },
    user_metadata: {
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      demo: true,
    },
    identities: [],
  } as unknown as User;

  return {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    token_type: 'bearer',
    expires_in: 60 * 60 * 24 * 365,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    user: demoUser,
  } as unknown as Session;
};

const demoSubscription: SubscriptionInfo = {
  id: 'demo-subscription',
  subscribed: true,
  tier: 'pro',
  expiresAt: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with null values to ensure logged out state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const { toast } = useToast();

  const [isDemo, setIsDemo] = useState(false);

  // Initialize the auth state
  useEffect(() => {
    // Restore demo session first (no backend calls needed)
    if (typeof window !== 'undefined' && localStorage.getItem(DEMO_STORAGE_KEY) === 'true') {
      const demoSession = buildDemoSession();
      setIsDemo(true);
      setSession(demoSession);
      setUser(demoSession.user);
      setSubscription(demoSubscription);
      setLoading(false);
      return;
    }

    // Set up auth state listener first
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If session changed, fetch subscription info but don't block UI
        if (currentSession?.user && event !== 'INITIAL_SESSION') {
          setTimeout(() => {
            fetchSubscription(currentSession.user.id);
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setSubscription(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchSubscription(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  // Fetch subscription details
  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          id: data.id,
          subscribed: data.subscribed,
          tier: data.subscription_tier as 'free' | 'pro',
          expiresAt: data.subscription_end ? new Date(data.subscription_end) : null
        });
      }
    } catch (error) {
      console.error('Error in subscription fetch:', error);
    }
  };

  const refreshSubscription = async () => {
    if (isDemo) {
      setSubscription(demoSubscription);
      return;
    }
    if (user) {
      await fetchSubscription(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Demo credentials bypass the backend
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoSession = buildDemoSession();
      localStorage.setItem(DEMO_STORAGE_KEY, 'true');
      setIsDemo(true);
      setSession(demoSession);
      setUser(demoSession.user);
      setSubscription(demoSubscription);
      setLoading(false);
      toast({
        title: 'Demo mode',
        description: 'Signed in as John Doe (demo account).',
      });
      return;
    }

    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      console.log("Sign in successful:", data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string,
    lastName: string,
    dateOfBirth: Date
  ) => {
    try {
      console.log("Attempting to sign up with email:", email, "first name:", firstName, "last name:", lastName);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth.toISOString().split('T')[0] // Format as YYYY-MM-DD
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Sign up successful:", data);
      toast({
        title: "Sign up successful",
        description: "Welcome to MediSynic!",
      });
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setIsDemo(false);
      setSession(null);
      setUser(null);
      setSubscription(null);
      toast({ title: 'Signed out', description: 'Demo session ended.' });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const isAuthenticated = !!session;
  const isPro = subscription?.tier === 'pro' && subscription?.subscribed;

  const value = {
    user,
    session,
    loading,
    subscription,
    isAuthenticated,
    isPro,
    signIn,
    signUp,
    signOut,
    refreshSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
