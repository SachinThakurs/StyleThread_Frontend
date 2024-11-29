import React from 'react';
import NoContentFound from './NoContentFound';
import { useAuth } from './Pages/Login/AuthContext';

// ProtectedRoute component
const ProtectedRoute = ({ element: Element, allowedRoles }) => {
    const { role } = useAuth(); // Get the user's role from AuthContext
  
    return allowedRoles.includes(role) ? (
      <Element />
    ) : (
      <NoContentFound /> // Redirect to Unauthorized component if not allowed
    );
  };
  

export default ProtectedRoute;
