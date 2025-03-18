import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // URL của API",
  timeout: 5000, // Giới hạn thời gian chờ request
});

const paymentApi = {
  paymentVnpay: (params) => axiosInstance.post("/payment/create-payment", params),
  paymentReturn: () => axiosInstance.get("/payment/vnpay-return"),
};

export default paymentApi;
