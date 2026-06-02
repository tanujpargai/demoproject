import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { profilesService } from '../services/profiles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile separately so we can refresh it independently
  const fetchProfile = async (userId) => {
    try {
      const p = await profilesService.getProfile(userId);
      setProfile(p);
      return p;
    } catch {
      setProfile(null);
    }
  };

  // Expose as refreshProfile so any component can call after an update
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        if (sessionUser) await fetchProfile(sessionUser.id);
      } catch (err) {
        console.error('Error fetching initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const subscription = authService.onAuthStateChange(async (event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.signIn(email, password);
      setUser(data.user);
      if (data.user) await fetchProfile(data.user.id);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.signUp(email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signUp,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
