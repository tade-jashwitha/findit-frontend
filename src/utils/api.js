// src/utils/api.js — Axios instance + all API calls
import axios from "axios";

// ── Base instance ─────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://findit-backend-0v6p.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});
// ── Attach JWT token to every request automatically ───────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("findit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-redirect on 401 ──────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("findit_token");
      localStorage.removeItem("findit_user");
      // Redirect to root — SPA uses page state, not URL routes
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ── Helper: extract a readable error message from any Axios error ─────
// Use this in your catch blocks:
//   catch (err) { toast.error(getErrorMessage(err)); }
export function getErrorMessage(err) {
  return (
    err.response?.data?.message ||   // your backend's { message: "..." }
    err.response?.data?.error   ||   // or { error: "..." }
    err.message                 ||   // Axios/network error
    "Something went wrong"
  );
}

// ── Token / user helpers ──────────────────────────────────────────────
export const authHelpers = {
  getToken:    ()    => localStorage.getItem("findit_token"),
  setToken:    (t)   => localStorage.setItem("findit_token", t),
  removeToken: ()    => localStorage.removeItem("findit_token"),
  getUser:     ()    => {
    const s = localStorage.getItem("findit_user");
    return s ? JSON.parse(s) : null;
  },
  setUser:     (u)   => localStorage.setItem("findit_user", JSON.stringify(u)),
  removeUser:  ()    => localStorage.removeItem("findit_user"),
};

// ═══════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════
export const authAPI = {
  // POST /api/auth/register  — body: { name, email, password }
  register: (data) => api.post("/auth/register", data),

  // POST /api/auth/login  — body: { email, password }
  login: (data) => api.post("/auth/login", data),

  // GET /api/auth/me  — returns logged-in user from token
  me: () => api.get("/auth/me"),
};

// ═══════════════════════════════════════════════════════════════════════
// ITEMS
// ═══════════════════════════════════════════════════════════════════════
export const itemsAPI = {
  // GET /api/items?type=lost&category=Electronics&search=apple
  getAll: (params) => api.get("/items", { params }),

  // GET /api/items/stats
  getStats: () => api.get("/items/stats"),

  // GET /api/items/:id
  getOne: (id) => api.get(`/items/${id}`),

  // POST /api/items  — multipart/form-data (supports image upload)
  create: (formData) =>
    api.post("/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // PATCH /api/items/:id/status  — body: { status }
  updateStatus: (id, status) => api.patch(`/items/${id}/status`, { status }),

  // DELETE /api/items/:id
  delete: (id) => api.delete(`/items/${id}`),
};

// ═══════════════════════════════════════════════════════════════════════
// AI
// ═══════════════════════════════════════════════════════════════════════
export const aiAPI = {
  // POST /api/ai/match  — multipart (sends image file)
  match: (formData) =>
    api.post("/ai/match", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // POST /api/ai/tags  — body: { description, title, category }
  generateTags: (data) => api.post("/ai/tags", data),
};

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════
export const notificationsAPI = {
  getAll:    ()   => api.get("/notifications"),
  readAll:   ()   => api.patch("/notifications/read-all"),
  readOne:   (id) => api.patch(`/notifications/${id}/read`),
};

// ═══════════════════════════════════════════════════════════════════════
// CLAIMS
// ═══════════════════════════════════════════════════════════════════════
export const claimsAPI = {
  sendClaim:   (itemId, message) => api.post(`/items/${itemId}/claim`, { message }),
  updateClaim: (itemId, claimId, status) => api.patch(`/items/${itemId}/claim/${claimId}`, { status }),
};

export default api;