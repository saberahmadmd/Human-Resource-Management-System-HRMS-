import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hrms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('hrms_user', JSON.stringify(userData));
    localStorage.setItem('hrms_token', token);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('hrms_user');
    localStorage.removeItem('hrms_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
