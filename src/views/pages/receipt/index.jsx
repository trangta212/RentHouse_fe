import React, { useRef, useEffect, useState } from "react";
import { Divider, Button, Result } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import paymentApi from "../../../api/paymentApi";
import { PostRentUpdate } from "../../../api/postRent";
import { createDeposit } from "../../../api/depositApi.js";

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
        const paymentMethod = searchParams.get("vnp_BankCode");
        const postId = searchParams.get("postId"); // Lấy postId từ URL

        // Kiểm tra kết quả thanh toán
        if (vnp_ResponseCode === "00") { 
          // Thanh toán thành công
          setPaymentStatus("success");
          setPaymentData({
            code: vnp_TxnRef,
            amount: Number(vnp_Amount) / 100, // Chuyển đổi từ VND sang đơn vị
            orderInfo: vnp_OrderInfo,
            payDate: vnp_PayDate,
            menthod: paymentMethod,
          });

          // Cập nhật trạng thái post thành active
          if (postId) {
            try {
              await PostRentUpdate(postId, {
                status: "active",
              });
              console.log("Post status updated successfully");
            } catch (updateError) {
              console.error("Error updating post status:", updateError);
              // Không throw error ở đây để không ảnh hưởng đến trải nghiệm người dùng
            }
          }
          const depositDataStr = localStorage.getItem("depositData");
          const storedFileListStr = localStorage.getItem("fileList");
          
          if (depositDataStr && storedFileListStr) {
            try {
              const depositData = JSON.parse(depositDataStr);
              const storedFileList = JSON.parse(storedFileListStr);
          
              const fullData = {
                ...depositData,
                cccd_images: storedFileList.map(file => file.originFileObj),
              };
          
              console.log("🔁 Thông tin gửi đi sau thanh toán:", fullData);
        
              try {
                const deposit = await createDeposit(fullData);
                console.log("Deposit created successfully:", deposit);
              } catch (error) {
                console.error("Lỗi khi tạo deposit:", error);
              }

              // ✅ Xóa sau khi xử lý thành công
              // localStorage.removeItem("depositData");
              // localStorage.removeItem("fileList");
            } catch (parseError) {
              console.error("❌ Lỗi khi parse dữ liệu localStorage:", parseError);
            }
          } else {
            console.warn("⚠️ Không tìm thấy dữ liệu trong localStorage!");
          }
        } else {
          // Thanh toán thất bại
          setPaymentStatus("error");

          // Cập nhật trạng thái post thành failed nếu có postId
          if (postId) {
            try {
              await PostRentUpdate(postId, {
                status: "pending",
              });
            } catch (updateError) {
              console.error("Error updating post status:", updateError);
            }
          }
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return `${dateString.slice(0, 4)}-${dateString.slice(
      4,
      6
    )}-${dateString.slice(6, 8)}`;
  };

  if (paymentStatus === "error") {
    return (
      <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
        <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
          <div className="flex flex-col items-center mt-5">
            <div className="h-[13%] w-[10%] mt-12">
              <img
                src={require("../../../assets/images/error-icon.png")}
                alt="images"
                className="imagesland"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <h1 className="text-[#3C5E39] font-bold text-2xl mt-7">
              Thanh toán không thành công
            </h1>
            <h2 className="text-slate-600 font-semibold mt-6 text-xl">
              Đã có lỗi xảy ra trong quá trình thanh toán
            </h2>
            <h2 className="text-slate-600 font-semibold mt-3 text-xl">
              Vui lòng thử lại sau
            </h2>
          </div>
          <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-20">
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
                {formatDate(paymentData?.payDate)}
              </span>
            </div>
            <div className="flex justify-between text-base mt-2 text-[17px]">
              <span>Phương thức thanh toán</span>
              <span className="font-semibold text-gray-800 text-[17px]">
                {paymentData?.menthod || "VNPAY"}
              </span>
            </div>
            <div className="flex items-center text-base mt-2 text-[17px]">
  <span style={{ flexBasis: "40%" }}>Nội dung thanh toán</span>
  <span
    className="font-semibold text-gray-800 text-[17px] truncate"
    style={{
      flexBasis: "60%", 
      display: "inline-block",
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis", 
    }}
  >
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
