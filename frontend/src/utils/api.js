
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
export const getAuthToken = () => {
  return localStorage.getItem("skillSwapToken");
};
export const messagesAPI = {
  listWith: (userId) => apiCall(`/messages?with=${encodeURIComponent(userId)}`),
  send: ({ to, text }) =>
    apiCall("/messages", {
      method: "POST",
      body: JSON.stringify({ to, text }),
    }),
  conversations: () => apiCall("/messages/conversations"),
  byCode: (code) => apiCall(`/messages/by/${encodeURIComponent(code)}`),
  upload: (formData) =>
    apiCall("/messages/upload", {
      method: "POST",
      body: formData,
    }),
};
export const sessionsAPI = {
  list: () => apiCall("/sessions"),
  create: ({ mode, topic, fromWhom, startAt, durationMinutes }) =>
    apiCall("/sessions", {
      method: "POST",
      body: JSON.stringify({ mode, topic, fromWhom, startAt, durationMinutes }),
    }),
};
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  if (options && options.body && typeof FormData !== "undefined" && options.body instanceof FormData) {
    delete headers["Content-Type"];
  }
  const config = { 
    ...options,
    headers,
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("skillSwapToken");
        try {
          if (typeof window !== "undefined" && window.location && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        } catch (_) {}
      }
      const message = isJson ? (payload.message || "API call failed") : payload?.slice(0, 200) || "API call failed";
      const err = new Error(`${response.status} ${response.statusText}: ${message}`);
      err.status = response.status;
      err.body = payload;
      throw err;
    }

    return payload;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
export const authAPI = {
  getProfile: () => apiCall("/auth/me"),
  login: (credentials) => 
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  signup: (userData) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};
export const favoritesAPI = {
  list: () => apiCall("/favorites"),
  addOrUpdate: (fav) =>
    apiCall("/favorites", {
      method: "POST",
      body: JSON.stringify(fav),
    }),
  remove: (externalId) =>
    apiCall(`/favorites/${encodeURIComponent(externalId)}`, {
      method: "DELETE",
    }),
};
export const notificationsAPI = {
  list: () => apiCall("/notifications"),
  create: (payload) =>
    apiCall("/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  markRead: (id) =>
    apiCall(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
    }),
  accept: (id) =>
    apiCall(`/notifications/${encodeURIComponent(id)}/accept`, {
      method: "POST",
    }),
};

export default apiCall;
