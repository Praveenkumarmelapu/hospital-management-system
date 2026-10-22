import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('hospital_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hospital_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setCurrentUser(res.data);
          localStorage.setItem('hospital_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to verify session token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, ...userData } = res.data;

      setToken(jwtToken);
      setCurrentUser(userData);
      localStorage.setItem('hospital_token', jwtToken);
      localStorage.setItem('hospital_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or login failure.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (patientData) => {
    try {
      setAuthError(null);
      const res = await api.post('/auth/register', patientData);
      const { token: jwtToken, ...userData } = res.data;

      setToken(jwtToken);
      setCurrentUser(userData);
      localStorage.setItem('hospital_token', jwtToken);
      localStorage.setItem('hospital_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('hospital_token');
    localStorage.removeItem('hospital_user');
  };

  const updateUser = (updatedData) => {
    const newObj = { ...currentUser, ...updatedData };
    setCurrentUser(newObj);
    localStorage.setItem('hospital_user', JSON.stringify(newObj));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!token && !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isPatient: currentUser?.role === 'patient',
        loading,
        authError,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
