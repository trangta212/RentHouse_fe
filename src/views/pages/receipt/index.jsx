import React, { useRef, useEffect, useState } from "react";
import { Divider, Button, Result } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import paymentApi from "../../../api/paymentApi";

const ReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const handlePaymentResponse = async () => {
      try {
        // Lấy thông tin từ URL
        const searchParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        const vnp_Amount = searchParams.get("vnp_Amount");
        const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
        const vnp_PayDate = searchParams.get("vnp_PayDate");

        // Kiểm tra kết quả thanh toán
        if (vnp_ResponseCode === "00") {
          // Thanh toán thành công
          setPaymentStatus("success");
          setPaymentData({
            code: vnp_TxnRef,
            amount: Number(vnp_Amount) / 100, // Chuyển đổi từ VND sang đơn vị
            orderInfo: vnp_OrderInfo,
            payDate: vnp_PayDate,
          });
        } else {
          // Thanh toán thất bại
          setPaymentStatus("error");
        }

        // Gọi API để cập nhật trạng thái thanh toán
        await paymentApi.paymentReturn();
      } catch (error) {
        console.error("Error handling payment response:", error);
        setPaymentStatus("error");
      }
    };

    handlePaymentResponse();
  }, [location]);

  const handleHomeClick = () => {
    navigate("/user/home");
  };

  const handleManagePosts = () => {
    navigate("/manage-posts");
  };

  if (paymentStatus === "error") {
    return (
      <div className="bg-[#D2DDBF] p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle="Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."
          extra={[
            <Button
              key="home"
              type="primary"
              onClick={handleHomeClick}
              className="bg-[#4caf4f] text-white px-6 py-2 rounded-lg hover:bg-[#45a049]"
            >
              Quay về trang chủ
            </Button>,
            <Button
              key="retry"
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </Button>,
          ]}
          />
        </div>
      </div>
    );
  }

  if (!paymentStatus || paymentStatus === "success") {
    return (
      <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
        <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
          <div className="flex flex-col items-center mt-5">
            <div className="h-[13%] w-[10%] mt-12">
              <img
                src={require("../../../assets/images/check.png")}
                alt="images"
                className="imagesland"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <h1 className="text-[#3C5E39] font-semibold text-2xl mt-7">
              Thanh toán thành công
            </h1>
            <h2 className="text-[#617C5F] font-semibold mt-3 text-3xl">
              {paymentData?.amount?.toLocaleString()} đ
            </h2>
          </div>
          <Divider />
          <div className="mt-3 ml-[10%] mr-[10%]">
            <div className="flex justify-between text-base mt-1 text-[17px]">
              <span>Mã thanh toán</span>
              <span className="font-semibold text-gray-800 text-[17px]">
                {paymentData?.code || "11458523"}
              </span>
            </div>
            <div className="flex justify-between text-base mt-2 text-[17px]">
              <span>Thời gian thanh toán</span>
              <span className="font-semibold text-gray-800 text-[17px]">
                {paymentData?.payDate
                  ? new Date(paymentData.payDate).toLocaleString()
                  : "2024-09-12 12:30:00"}
              </span>
            </div>
            <div className="flex justify-between text-base mt-2 text-[17px]">
              <span>Phương thức thanh toán</span>
              <span className="font-semibold text-gray-800 text-[17px]">
                Vnpay
              </span>
            </div>
            <div className="flex justify-between text-base mt-2 text-[17px]">
              <span>Nội dung thanh toán</span>
              <span className="font-semibold text-gray-800 text-[17px]">
                {paymentData?.orderInfo || "Thanh toán tiền đăng tin"}
              </span>
            </div>
          </div>
          <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-10">
            <Button
              onClick={handleHomeClick}
              className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
            >
              Quay về trang chủ
            </Button>
            <Button
              onClick={handleManagePosts}
              className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
            >
              Quản lý tin đăng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReceiptPage;
