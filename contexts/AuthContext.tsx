
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured) {
      console.log('⚠️ Supabase is not configured. Authentication features are disabled.');
      console.log('📝 To enable authentication:');
      console.log('   1. Open the .env file in your project root');
      console.log('   2. Add your Supabase anon key');
      console.log('   3. Restart the Expo development server');
      console.log('   4. Get your keys from: https://supabase.com/dashboard/project/rgayzlgixuxfmdplyoum/settings/api');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('✅ Supabase connected successfully');
    }).catch((error) => {
      console.error('❌ Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log('🔄 Auth state changed:', _event);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { 
        error: { 
          message: 'Supabase not configured. Please update your .env file with Supabase credentials.' 
        } 
      };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Sign in error:', error.message);
      } else {
        console.log('✅ Signed in successfully');
      }
      return { error };
    } catch (error: any) {
      console.error('❌ Sign in exception:', error);
      return { error: { message: error.message || 'An error occurred during sign in' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isConfigured) {
      return { 
        error: { 
          message: 'Supabase not configured. Please update your .env file with Supabase credentials.' 
        } 
      };
    }
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });
      if (error) {
        console.error('❌ Sign up error:', error.message);
      } else {
        console.log('✅ Signed up successfully - check email for verification');
      }
      return { error };
    } catch (error: any) {
      console.error('❌ Sign up exception:', error);
      return { error: { message: error.message || 'An error occurred during sign up' } };
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      console.log('⚠️ Supabase not configured');
      return;
    }
    
    try {
      await supabase.auth.signOut();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
