// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setAuthToken } from "./api";
import ScrollToTop from "./Component/ScrollToTop";

// Public pages
import Home from "./Pages/Home";
import ArticlesPage from "./Pages/ArticlesPage";
import ArticlePage from "./Pages/ArticlePage";
import PublicationsPage from "./Pages/PublicationsPage";
import BiographyPage from "./Pages/BiographyPage";

import ContactPage from "./Pages/ContactPage";

// Admin pages
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminLoginPage from "./Pages/Admin/AdminLogin";
import AdminRegisterPage from "./Pages/Admin/Adminregister";
import Articles from "./Pages/Admin/Articles";
import Banners from "./Pages/Admin/Banners";
import Biography from "./Pages/Admin/Biography";
import Media from "./Pages/Admin/Media";
import Users from "./Pages/Admin/Users";
import AdminPublications from "./Pages/Admin/Publications";

// Protection components
import AccessCodeGate from "./Component/Admin/AccessCodeGate";
import ProtectedAdminRoute from "./Component/Admin/ProtectedAdminRoute";
import AdminRedirect from "./Component/Admin/AdminRedirect";
import GalleryPage from "./Pages/GalleryPage";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/biography" element={<BiographyPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* ===== ADMIN ACCESS CODE GATE ===== */}
        <Route path="/admin/access" element={<AccessCodeGate />} />

        {/* ===== /admin → smart redirect ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminRedirect />
            </ProtectedAdminRoute>
          }
        />

        {/* ===== AUTH PAGES (need access code only, not login) ===== */}
        <Route
          path="/admin/login"
          element={
            <ProtectedAdminRoute>
              <AdminLoginPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <ProtectedAdminRoute>
              <AdminRegisterPage />
            </ProtectedAdminRoute>
          }
        />

        {/* ===== DASHBOARD PAGES (need access code + login) ===== */}
        <Route
          element={
            <ProtectedAdminRoute requireAuth>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="/admin/articles" element={<Articles />} />
          <Route path="/admin/banners" element={<Banners />} />
          <Route path="/admin/publications" element={<AdminPublications />} />
          <Route path="/admin/biography" element={<Biography />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/media" element={<Media />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;