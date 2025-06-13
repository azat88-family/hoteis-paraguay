import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of roles that are allowed to access the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth(); // Get user object
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking authentication
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role; // Assuming role is directly on user object as per AuthContext
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to an unauthorized page if role is not permitted
      // You might want to pass some state to the unauthorized page, e.g., from: location.pathname
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
