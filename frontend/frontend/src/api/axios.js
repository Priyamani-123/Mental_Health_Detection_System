import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 🔥 avoid hanging requests
});

// 🔥 REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 DEBUG (VERY USEFUL)
    console.log("➡️ API REQUEST:", config.url);

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// 🔥 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => {
    console.log("✅ API RESPONSE:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API ERROR FULL:", error);
    console.error("❌ API ERROR DATA:", error.response?.data);

    // 🔥 AUTO LOGOUT IF TOKEN EXPIRED
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired / Unauthorized");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // optional redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;