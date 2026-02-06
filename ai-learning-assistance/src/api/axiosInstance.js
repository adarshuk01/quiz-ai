import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODQyNjZkYmE0Mjg3NjY4MTNhODA3OSIsImlhdCI6MTc3MDI2ODI3MCwiZXhwIjoxNzcwODczMDcwfQ.aEUwa0nYLEVegpT5-adq1ngKGyY1mGzXarX2gK0JTtE`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
