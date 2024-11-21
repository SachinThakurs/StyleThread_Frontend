import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Assuming the role is stored in the token
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token'); // Remove invalid token
        setToken(null); // Clear token
        setRole(null); // Clear role
      }
    } else {
      setRole(null); // Clear role if no token
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
