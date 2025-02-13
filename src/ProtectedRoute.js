import { Navigate } from "react-router-dom";
import { useAuth } from "./Pages/Login/AuthContext";
import NoContentFound from "./NoContentFound";
import { showToast } from "./Utils/Helper/ToastNotifications";
import { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { role, token } = useAuth(); // Get the user's role and token from AuthContext
  const loadingRef = useRef(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      loadingRef.current?.continuousStart(); // Start the loading bar
      showToast("error", "Please Login first.");
      setTimeout(() => {
        loadingRef.current?.complete(); // Stop loader after delay
        setRedirect(true); // Trigger redirect after loader completes
      }, 500);
    }
  }, [token]);

  // Show the loading bar
  if (redirect) {
    return <Navigate to="/auth" replace />;
  }

  // If the user's role is not allowed, show "NoContentFound"
  if (token && !allowedRoles.includes(role)) {
    return <NoContentFound />;
  }

  // If everything is valid, render the component
  return (
    <>
      <LoadingBar color="#f11946" ref={loadingRef} />
      <Element />
    </>
  );
};

export default ProtectedRoute;
