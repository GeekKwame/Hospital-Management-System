import { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedAuth = localStorage.getItem('hms-auth');
    
    if (storedToken) {
      setToken(storedToken);
      if (storedAuth) {
        try {
          const auth = JSON.parse(storedAuth);
          setUser(auth.user);
        } catch (e) {
          console.error('Failed to parse stored auth', e);
        }
      }
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (authToken = token) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    
    // Try to load user from stored auth data first
    const storedAuth = localStorage.getItem('hms-auth');
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        if (auth.user) {
          setUser(auth.user);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored auth', e);
      }
    }
    
    // If no stored user, try to fetch from API (endpoint may not exist)
    try {
      const response = await apiClient('/users/me', { token: authToken });
      const userData = response.user || response;
      setUser(userData);
      localStorage.setItem('hms-auth', JSON.stringify({ token: authToken, user: userData }));
      setError(null);
    } catch (err) {
      // Endpoint might not exist - that's okay, user will be set on login
      console.warn('User profile endpoint not available, using stored data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: credentials
      });
      
      const authToken = response.token || response.data?.token;
      const userData = response.user || response.data?.user || response;
      
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
      }
      
      setUser(userData);
      localStorage.setItem('hms-auth', JSON.stringify({ token: authToken, user: userData }));
      setError(null);
      return { token: authToken, user: userData };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiClient('/auth/register', {
        method: 'POST',
        body: userData
      });
      
      // Register endpoint doesn't return a token - user needs to login
      const user = response.user || response;
      setError(null);
      return { user };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hms-auth');
    setUser(null);
    setToken(null);
  };

  // Support both patterns: { user, token, ... } and { auth: { user, token } }
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    // Legacy support for pages using auth.token pattern
    auth: {
      user,
      token,
    },
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

export default AuthContext;
