import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const state = useSelector((state) => state.manageContacts);
  
    // Check if the user is authenticated
    if (!state.accessToken) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If authenticated, render the child routes
    return <Outlet />;
  };