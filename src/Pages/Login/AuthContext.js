import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(null); // Store the user role
  const navigate = useNavigate();

  // Decode the token to extract expiration and role
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
      return payload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = decodeToken(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < currentTime; // Compare with token expiration
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    navigate("/auth");
  };

  // Automatically log out if token is expired
  useEffect(() => {
    if (isTokenExpired(token)) {
      handleLogout();
    }
  }, [token]);

  // Periodic check for token expiration
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        handleLogout();
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [token]);

  // Update role whenever token changes
  useEffect(() => {
    if (token) {
      const payload = decodeToken(token);
      setRole(payload?.role || null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
