// components/admin/AdminRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRedirect = () => {
  const { admin } = useSelector((state) => state.user);

  if (admin) {
    return <Navigate to="/admin/articles" replace />;
  }

  return <Navigate to="/admin/login" replace />;
};

export default AdminRedirect;