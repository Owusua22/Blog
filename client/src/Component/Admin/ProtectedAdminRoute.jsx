// components/admin/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = ({ children, requireAuth = false }) => {
  const location = useLocation();
  const { admin } = useSelector((state) => state.user);

  // Check access code
  const accessGranted =
    sessionStorage.getItem("adminAccessGranted") === "true";
  const accessTime = parseInt(
    sessionStorage.getItem("adminAccessTime") || "0",
    10
  );
  const EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  const isExpired = Date.now() - accessTime > EXPIRY;

  // If no access code or expired → go to access gate
  if (!accessGranted || isExpired) {
    if (isExpired) {
      sessionStorage.removeItem("adminAccessGranted");
      sessionStorage.removeItem("adminAccessTime");
    }
    return <Navigate to="/admin/access" replace />;
  }

  // If route needs login and user is not logged in → go to login
  if (requireAuth && !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;