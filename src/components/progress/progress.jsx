import React, { useState } from "react";
import { Button, Flex, Progress, Space } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toast
import paymentApi from "../../api/paymentApi"

const ProgressComponent = ({
  steps,
  errors,
  trigger,
  getValues,
  totalPrice,
}) => {
  const [step, setStep] = useState(0); // Bắt đầu từ bước 0
  const [payUrl, setPayUrl] = useState("");

  const increase = async () => {
    const isValid = await trigger(`step${step}`); // Kiểm tra dữ liệu hợp lệ cho bước hiện tại
    const values = getValues(); // Lấy tất cả giá trị hiện tại của form

    console.log(`Validation Step ${step}:`, isValid, errors, values);

    if (step === 0) {
      // Validation cho bước 1
      if (
        !values.dropdown ||
        !values.erea ||
        !values.price ||
        !values.textField ||
        !values.email ||
        !values.phone ||
        !values.textInputTitle ||
        !values.textInputNaiyo
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    } else if (step === 1) {
      // Validation cho bước 2 (upload ảnh)
      const images = values.images || [];
      if (!images || images.length < 3) {
        toast.error("Vui lòng tải lên ít nhất 3 ảnh!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (images.length > 15) {
        toast.error("Chỉ được tải lên tối đa 15 ảnh!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    } else if (step === 2) {
      // Validation cho bước 3
      if (Number(totalPrice) === 0) {
        toast.error("Vui lòng chọn loại tin và thời gian đăng tin!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    } else if (step === 3) {
      console.log("🔄 Đang thực hiện thanh toán...");
      try {
        const values = getValues();
        console.log("📋 Form Values:", values); // Log all form values
        console.log("Total Price:", totalPrice); // Log totalPrice

        const amountNumber = typeof totalPrice === "string" 
        ? Number(totalPrice.replace(/[.,]/g, ""))  // Loại bỏ cả dấu chấm và phẩy
        : totalPrice;
        const orderInfo =
          values.textField !== null ? String(values.textField) : "nội dung";

        const response = await paymentApi.paymentVnpay({
          amount: amountNumber, // Sử dụng totalPrice làm amount
          orderInfo: orderInfo, // Sử dụng values.textField làm orderInfo
        });

        console.log("✅ Phản hồi từ API thanh toán:", response);

        if (response.data && response.data.paymentUrl) {
          console.log("🔗 URL thanh toán nhận được:", response.data.paymentUrl);
          setPayUrl(response.data.paymentUrl);

          // Chuyển hướng khi nhấn "Thanh toán ngay"
          window.location.href = response.data.paymentUrl;
        } else {
          console.error("❌ Không nhận được URL thanh toán!");
          toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("❌ Lỗi khi tạo URL thanh toán:", error);
        toast.error("Lỗi khi tạo thanh toán. Vui lòng thử lại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }

    const amountNumber = typeof totalPrice === "string" 
        ? Number(totalPrice.replace(/[.,]/g, ""))  // Loại bỏ cả dấu chấm và phẩy
        : totalPrice;
        const orderInfo =
          values.textField !== null ? String(values.textField) : "nội dung";
    console.log(amountNumber, orderInfo);
    

    
    

    if (step < steps.length - 1) {
      console.log(`➡️ Chuyển sang bước ${step + 1}`);
      setStep((prev) => prev + 1);
      // } else if (step === steps.length - 1 && totalPrice > 0) {
      //   console.log("🚀 Chuyển sang trang thanh toán...");
    } else {
      console.log("⚠️ Tổng tiền bằng 0, không thể tiếp tục.");
    }
  };

  const decline = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <Flex vertical gap="medium">
      {/* Thanh tiến trình */}
      <Progress
        percent={(step / (steps.length - 1)) * 100}
        type="line"
        showInfo={false}
      />

      <div key={`step-${step}`}>
        {/* Hiển thị form tương ứng với bước hiện tại */}
        <div>{steps[step]}</div>
      </div>
      {/* Nút điều hướng */}
      <Space className="flex justify-between mt-11 py-11 space-x-6">
        <Button
          onClick={decline}
          disabled={step === 0}
          className="text-lg font-semibold rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 h-12 w-35"
        >
          Quay lại
        </Button>
        {/* Hiển thị tổng tiền ở bước cuối */}
        <div className="flex justify-end items-center">
          {step === 2 ? (
            <div className="flex justify-end items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tổng tiền: {totalPrice.toLocaleString()} đ
              </h2>
              <div className="border-l-2 border-gray-300 h-6"></div>
              <Button
                onClick={() => {
                  increase();
                }}
                type="primary"
                disabled={Number(totalPrice) === 0}
                className={`text-lg font-semibold rounded-full
          h-12 w-35
          ${
            Number(totalPrice) === 0
              ? "bg-gray-200 text-gray-700 cursor-not-allowed"
              : "bg-[#4caf4f] text-white"
          }
        `}
              >
                Tiếp tục
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                console.log("💰 Amount before click:", Number(totalPrice)); // Log amount before click
                console.log(
                  "📝 Order Info before click:",
                  getValues().textField
                ); // Log orderInfo before click
                increase();
              }}
              type="primary"
              className="text-lg font-semibold rounded-full bg-[#4caf4f] text-white h-12 w-35"
            >
              Tiếp tục
            </Button>
          )}
        </div>
      </Space>
    </Flex>
  );
};

export default ProgressComponent;
