import React, { useState } from "react";
import { Button, Flex, Progress, Space } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toast

const ProgressComponent = ({
  steps,
  errors,
  register,
  trigger,
  getValues,
  totalPrice,
}) => {
  const [step, setStep] = useState(0); // Bắt đầu từ bước 0


  const increase = async () => {
    const isValid = await trigger(`step${step}`); // Kiểm tra dữ liệu hợp lệ cho bước hiện tại
    const values = getValues(); // Lấy tất cả giá trị hiện tại của form

    console.log(`Validation Step ${step}:`, isValid, errors, values);

    // Kiểm tra nếu có lỗi hoặc giá trị rỗng thì không cho chuyển tab
    // if (
    //   !isValid ||
    //   Object.values(values).some((value) => value === "" || value === undefined)
    // ) {
    //   console.log("Có lỗi hoặc chưa nhập đủ dữ liệu, không chuyển bước!");
    //   toast.error("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục!", {
    //     position: "top-right",
    //     autoClose: 3000, // Ẩn sau 3 giây
    //   });
    //   return; // Dừng nếu có lỗi hoặc chưa nhập gì
    // }
    if (step === 0) {
      // Validation cho bước 1
      if (!values.dropdown || !values.erea || !values.price || !values.textField || !values.email || !values.phone || !values.textInputTitle || !values.textInputNaiyo) {
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
    }
    
    if (step < steps.length - 1) {
      console.log(`➡️ Chuyển sang bước ${step + 1}`);
      setStep((prev) => prev + 1);
      // } else if (step === steps.length - 1 && totalPrice > 0) {
      //   console.log("🚀 Chuyển sang trang thanh toán...");
    } else {
      console.log("⚠️ Tổng tiền bằng 0, không thể tiếp tục.");
    }
  };

  console.log("Total Price:", totalPrice, "Type:", typeof totalPrice);

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
                onClick={increase}
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
              onClick={increase}
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
