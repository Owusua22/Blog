import axios from "axios";

const API_BASE_URL = "http://54.226.160.175:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set token globally (optional but recommended)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Always read token from localStorage for per-request headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null"
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// --------------------
// USER APIs (match your routes)
// POST /api/users/register
// POST /api/users/login
// PUT  /api/users/profile (protected)
// --------------------
export const registerUser = (data) => api.post("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);
export const registerAdmin = (data) => api.post("/users/admin/register", data);
export const loginAdmin = (data) => api.post("/users/admin/login", data);

export const updateUser = (data) =>
  api.put("/users/profile", data, { headers: { ...authHeader() } });

// --------------------
// ARTICLE APIs (FormData => set multipart correctly)
// backend endpoints assumed:
// GET  /api/articles
// GET  /api/articles/:id
// POST /api/articles (protected)
// --------------------
export const getArticles = () => api.get("/articles");
export const getArticle = (id) => api.get(`/articles/${id}`);

export const createArticle = (formData) =>
  api.post("/articles", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const updateArticle = (id, formData) =>
  api.put(`/articles/${id}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`, { headers: { ...authHeader() } });

export const likeArticle = (id) =>
  api.post(`/articles/${id}/like`, null, { headers: { ...authHeader() } });

// --------------------
// COMMENTS APIs
// --------------------
export const addComment = (articleId, data) =>
  api.post(`/comments/${articleId}`, data, { headers: { ...authHeader() } });

export const getCommentsByArticle = (articleId) =>
  api.get(`/comments/${articleId}`);

export const getComment = (commentId) =>
  api.get(`/comments/comment/${commentId}`);

export const updateComment = (commentId, data) =>
  api.put(`/comments/comment/${commentId}`, data, { headers: { ...authHeader() } });

export const deleteComment = (commentId) =>
  api.delete(`/comments/comment/${commentId}`, { headers: { ...authHeader() } });

// --------------------
// BANNER APIs (FormData => multipart)
// --------------------
export const getBanners = () => api.get("/banners");
export const getBanner = (id) => api.get(`/banners/${id}`);

export const createBanner = (formData) =>
  api.post("/banners", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBanner = (id, formData) =>
  api.put(`/banners/${id}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBanner = (id) =>
  api.delete(`/banners/${id}`, { headers: { ...authHeader() } });
// --------------------
// PUBLICATION APIs (PDF uploads)
// --------------------

export const getPublications = () => api.get("/publications");

export const getPublication = (id) =>
  api.get(`/publications/${id}`);

export const createPublication = (formData) =>
  api.post("/publications", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const updatePublication = (id, formData) =>
  api.put(`/publications/${id}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

export const deletePublication = (id) =>
  api.delete(`/publications/${id}`, {
    headers: { ...authHeader() },
  });
  // --------------------
// BIOGRAPHY APIs
// --------------------

// GET biography (usually only one)
export const getBiography = () => api.get("/biography");

// GET single biography by ID (if needed)
export const getBiographyById = (id) => api.get(`/biography/${id}`);

// CREATE biography (admin only, supports image upload)
export const createBiography = (formData) =>
  api.post("/biography", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

// UPDATE biography (admin only, supports image upload)
export const updateBiography = (id, formData) =>
  api.put(`/biography/${id}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE biography (admin only)
export const deleteBiography = (id) =>
  api.delete(`/biography/${id}`, { headers: { ...authHeader() } });



export default api;