import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
// Removed complex auth utilities - using direct Supabase auth state
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  user_metadata?: {
    userType?: string;
    fullName?: string;
    [key: string]: unknown;
  };
  app_metadata?: {
    userType?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPermission: (requiredRole?: string) => boolean;
  isEmailVerified: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const refreshUser = async () => {
    try {
      // Try to get current session first
       let { data: { session } } = await supabase.auth.getSession();
      
      // If session is expired, try to refresh it
      if (session && session.expires_at) {
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at < now) {
          const refreshResult = await supabase.auth.refreshSession();
          if (!refreshResult.error && refreshResult.data.session) {
            session = refreshResult.data.session;
          } else {
            console.error('Session refresh failed:', refreshResult.error);
            session = null;
          }
        }
      }
      
      if (session?.user) {
        setUser(session.user as unknown as User);
        setSession(session);
        setIsAuth(true);
      } else {
        setUser(null);
        setSession(null);
        setIsAuth(false);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setSession(null);
      setIsAuth(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuth(false);
      // Clear local session data
      localStorage.removeItem('bridge_session_id');
      localStorage.removeItem('bridge_session_data');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkPermission = (requiredRole?: string): boolean => {
    if (!user || !requiredRole) return true;
    
    const userRole = user.user_metadata?.userType || user.app_metadata?.userType;
    return userRole === requiredRole;
  };

  const isEmailVerified = (): boolean => {
    return !!(user?.email_confirmed_at);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session directly from Supabase
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            setIsAuth(true);
            setUser(initialSession.user as unknown as User);
          } else {
            setIsAuth(false);
            setUser(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsAuth(false);
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);
        
        setSession(newSession);
        
        switch (event) {
          case 'SIGNED_IN':
            if (newSession?.user) {
              setIsAuth(true);
              setUser(newSession.user as unknown as User);
              toast.success('Successfully signed in');
            }
            break;
            
          case 'SIGNED_OUT':
            setIsAuth(false);
            setUser(null);
            // Clear any local session data
            localStorage.removeItem('bridge_session_id');
            localStorage.removeItem('bridge_session_data');
            break;
            
          case 'TOKEN_REFRESHED':
            if (newSession?.user) {
              setUser(newSession.user as unknown as User);
              setIsAuth(true);
              console.log('Token refreshed successfully');
            }
            break;
            
          case 'USER_UPDATED':
            if (newSession?.user) {
              setUser(newSession.user as unknown as User);
            }
            break;
            
          default:
            break;
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Removed complex session validation - relying on Supabase's built-in auth state management

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: isAuth,
    signOut,
    refreshUser,
    checkPermission,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;