import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const ProtectedRoute = ({ children, role }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
