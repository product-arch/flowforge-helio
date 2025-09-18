import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (username: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string, rememberMe?: boolean) => {
    try {
      setLoading(true);
      
      // For the admin user, we'll use a hardcoded email
      if (username === 'admin' && password === 'admin') {
        // Try to sign in with the admin credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'drklrd077@gmail.com',
          password: 'admin123',
        });
        
        if (error) {
          // If admin user doesn't exist, create it
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'drklrd077@gmail.com',
            password: 'admin123',
            options: {
              data: {
                username: 'admin'
              },
              emailRedirectTo: `${window.location.origin}/`
            }
          });
          
          if (signUpError) {
            setLoading(false);
            return { error: signUpError.message };
          }
          
          // After signup, try to sign in again
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'drklrd077@gmail.com',
            password: 'admin123',
          });
          
          if (signInError) {
            setLoading(false);
            return { error: signInError.message };
          }
        }
        
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: 'Invalid username or password' };
      }
    } catch (error) {
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};