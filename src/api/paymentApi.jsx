import axiosInstance from "../untils/axiosInstance.js";

const paymentApi = {
  paymentVnpay: (params) => axiosInstance.post("/payment/create-payment", params),
  paymentReturn: () => axiosInstance.get("/payment/vnpay-return"),
};

export default paymentApi;
