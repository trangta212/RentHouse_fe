import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Thay đổi nếu cần
});

// Thêm token vào header trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
