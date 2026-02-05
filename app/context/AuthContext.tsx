'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { removeToken, setToken, isAdmin } from '@/lib/auth';
import { fetchUserData } from '@/lib/api';

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: 'END_USER' | 'BUSINESS_OWNER' | 'ADMIN' | null;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase, get the token and fetch user data
        try {
          const token = await firebaseUser.getIdToken();
          setToken(token);

          // Fetch user data from API
          const userData = await fetchUserData();

          if (!userData) {
            throw new Error('Failed to fetch user data');
          }

          // Check if user has ADMIN role
          if (!isAdmin(userData.role)) {
            console.error('Access denied: User is not an admin');
            await logout();
            setIsLoading(false);
            return;
          }

          setUser(userData);
        } catch (error) {
          console.error('Auth error:', error);
          removeToken();
          setUser(null);
        }
      } else {
        // User is signed out
        removeToken();
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    try {
      await auth.signOut();
      removeToken();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: isAdmin(user?.role),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
