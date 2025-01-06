import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthRedirect = () => {
  const { token } = useAuth();

  // Navigate to the home page if logged in, otherwise go to the login page
  return token ? <Navigate to="/home" replace /> : <Navigate to="/auth" replace />;
};

export default AuthRedirect;
