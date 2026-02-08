import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://quiz-ai-orpin.vercel.app/api",
});

// https://quiz-ai-orpin.vercel.app/api

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
