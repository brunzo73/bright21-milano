import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('admin_authenticated');
      setIsAuthenticated(authStatus === 'true');
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
};