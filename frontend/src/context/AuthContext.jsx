import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub, role: decoded.role });
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const decoded = jwtDecode(access_token);
    setUser({ email: decoded.sub, role: decoded.role });
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  };

  const requestOtp = async (email) => {
    await api.post('/auth/request-otp', { email });
  };

  const verifyOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const decoded = jwtDecode(access_token);
    setUser({ email: decoded.sub, role: decoded.role });
    return decoded.role;
  };

  const selectRole = async (role) => {
    const response = await api.post('/auth/select-role', { role });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    const decoded = jwtDecode(access_token);
    setUser({ email: decoded.sub, role: decoded.role });
  };

  const requestPasswordResetOtp = async (email) => {
    await api.post('/auth/forgot-password-otp', { email });
  };

  const resetPassword = async (email, otp, newPassword) => {
    await api.post('/auth/reset-password', { email, otp, new_password: newPassword });
  };

  const setupUserPassword = async (newPassword) => {
    await api.post('/auth/setup-password', { new_password: newPassword });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, requestOtp, verifyOtp, selectRole, requestPasswordResetOtp, resetPassword, setupUserPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
