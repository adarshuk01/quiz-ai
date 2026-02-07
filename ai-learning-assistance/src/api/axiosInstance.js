import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://quiz-ai-orpin.vercel.app/api",
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODVhYTFkMTRjNGU1MGEyNDJlMGIwYyIsImlhdCI6MTc3MDM2NzUxOCwiZXhwIjoxNzcwOTcyMzE4fQ._vz5nyO0FPiBM1G1tdJ0d7cdJ3n9v0ursPWrjsNOaQw`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
