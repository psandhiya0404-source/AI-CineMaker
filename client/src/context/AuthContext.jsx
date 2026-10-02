import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cinemaker_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cinemaker_token');
      const storedUser = localStorage.getItem('cinemaker_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await authApi.getMe();
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('cinemaker_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('[Auth] Token invalid or expired, clearing session');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const userData = res.data.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('cinemaker_token', userData.token);
    localStorage.setItem('cinemaker_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const userData = res.data.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('cinemaker_token', userData.token);
    localStorage.setItem('cinemaker_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cinemaker_token');
    localStorage.removeItem('cinemaker_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
