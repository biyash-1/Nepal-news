import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API base URL
  withCredentials: true, // optional if using cookies
});

// Automatically attach token from localStorage
axiosInstance.interceptors.request.use((config:any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
