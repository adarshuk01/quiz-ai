import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://quiz-ai-orpin.vercel.app/api",
});

// ============================
// Attach Token Automatically
// ============================
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

// ============================
// Handle 401 Globally
// ============================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;

// https://quiz-ai-orpin.vercel.app/api