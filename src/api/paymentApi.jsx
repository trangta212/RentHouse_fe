import axiosInstance from "../untils/axiosInstance.js";

const paymentApi = {
  paymentVnpay: (params) => axiosInstance.post("/payment/create-payment", params),
  paymentReturn: () => axiosInstance.get("/payment/vnpay-return"),
  createMomoPayment: (params) => axiosInstance.post("/payment/momo/create", params),
   paymentReturnByMomo: (queryString) => {
    console.log("Sending MoMo query string:", queryString); // Log để debug
    return axiosInstance.get(`/payment/momo-return${queryString}`);
  },
};

export default paymentApi;
