import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow access
  return <Outlet />;
}

export default ProtectedRoute;
