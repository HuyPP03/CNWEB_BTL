// src/services/api.ts
import axios from "axios";

const API_URL = "https://cnweb-btl.onrender.com/api";

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
        // Nếu lỗi 401, AuthContext sẽ tự động xử lý refresh token hoặc logout
        return Promise.reject(error);
    }
);

export default api;
