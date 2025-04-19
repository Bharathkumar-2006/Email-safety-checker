import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add a request interceptor to include token if available
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

// Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., token expired
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
