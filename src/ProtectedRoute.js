// import React from 'react';
// import NoContentFound from './NoContentFound';
// import { useAuth } from './Pages/Login/AuthContext';

// // ProtectedRoute component
// const ProtectedRoute = ({ element: Element, allowedRoles }) => {
//     const { role } = useAuth(); // Get the user's role from AuthContext
  
//     return allowedRoles.includes(role) ? (
//       <Element />
//     ) : (
//       <NoContentFound /> // Redirect to Unauthorized component if not allowed
//     );
//   };
  

// export default ProtectedRoute;



import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Pages/Login/AuthContext";
import NoContentFound from "./NoContentFound";

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { role, token } = useAuth(); // Get the user's role and token from AuthContext

  // If the user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If the user's role is not allowed, show "NoContentFound"
  if (!allowedRoles.includes(role)) {
    return <NoContentFound />;
  }

  // If everything is valid, render the component
  return <Element />;
};

export default ProtectedRoute;
