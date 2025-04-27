// src/services/api.ts
import axios from "axios";

const API_URL = "https://web-backend-npbc.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect về login
      }
      return Promise.reject(error);
    }
  );

export default api;
