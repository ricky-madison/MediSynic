import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Single demo account: the app runs entirely on this local session
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(DEMO_STORAGE_KEY) === 'true') {
      const demoSession = buildDemoSession();
      setSession(demoSession);
      setUser(demoSession.user);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoSession = buildDemoSession();
      localStorage.setItem(DEMO_STORAGE_KEY, 'true');
      setSession(demoSession);
      setUser(demoSession.user);
      setLoading(false);
      toast({
        title: 'Signed in',
        description: 'Welcome back, John Doe.',
      });
      return;
    }

    toast({
      title: 'Login failed',
      description: `Use the demo credentials: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`,
      variant: 'destructive',
    });
    throw new Error('Invalid credentials');
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setSession(null);
    setUser(null);
    toast({ title: 'Signed out', description: 'Your session has ended.' });
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signIn,
    signOut,
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
