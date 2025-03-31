// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/users/admin/validate`);
        setAdmin(data.user);
      } catch (error) {
        setAdmin(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await axios.post(`${API_URL}/api/v1/users/admin/login`, credentials);
    localStorage.setItem('adminToken', data.accessToken);
    setAdmin(data.user);
  };

  const logout = async () => {
    await axios.post(`${API_URL}/api/v1/users/admin/logout`);
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      admin,
      loading,
      isAuthenticated: !!admin,
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);