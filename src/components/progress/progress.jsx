import React, { useState, useCallback, useEffect } from "react";
import { Button, Flex, Progress, Space } from "antd";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import paymentApi from "../../api/paymentApi";
import { PostRentCreate, PostRentUpdate } from "../../api/postRent";

const ProgressComponent = ({
  steps = [],
  errors = {},
  trigger,
  getValues,
  totalPrice = 0,
  startDate = null,
  endDate = null,
}) => {
  const [step, setStep] = useState(0);
  const [payUrl, setPayUrl] = useState("");
  const [postId, setPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // Đảm bảo steps là một mảng
  useEffect(() => {
    if (!Array.isArray(steps)) {
      console.error("Steps must be an array");
    }
  }, [steps]);

  // Cập nhật formData khi có thay đổi
  useEffect(() => {
    const values = getValues();
    if (values) {
      setFormData(values);
    }
  }, [getValues]);

  const handlePostData = async (values, isUpdate = false) => {
    try {
      setIsLoading(true);
      console.log("Starting handlePostData with values:", values);

      // Validate values
      if (!values) {
        console.error("Values is undefined or null");
        throw new Error("Dữ liệu không hợp lệ");
      }

      // let room_images = [];

      // Xử lý ảnh ở bước 1 trở đi
      // if (step > 0) {
      //   const images = values?.images || [];
      //   console.log("📸 Raw images from form:", images);

      //   if (Array.isArray(images)) {
      //     room_images = images
      //       .map((img) => {
      //         console.log("🖼️ Processing image:", img);
      //         if (img instanceof File) {
      //           console.log("📄 File object:", img.name);
      //           return img.name;
      //         }
      //         if (typeof img === "string") {
      //           console.log("📝 String image:", img);
      //           return img;
      //         }
      //         if (img && img.name) {
      //           console.log("📋 Object with name:", img.name);
      //           return img.name;
      //         }
      //         return "";
      //       })
      //       .filter((name) => name);

      //     console.log("🎯 Final room_images array:", room_images);
      //   }
      // }

      // Tạo postData với các trường tương ứng với từng bước
      const postData = {
        email: values?.email || "",
        lastName: values?.textField || "",
        phone_number: values?.phone || "",
        room_name: values?.textInputTitle || "",
        description: values?.textInputNaiyo || "",
        price_per_month: Number(values?.price) || 0,
        type: values?.dropdown || "",
        area: Number(values?.erea) || 0,
        room_images: values?.images || [],
        start_date: startDate?.format("YYYY-MM-DD") || null,
        expire: endDate?.format("YYYY-MM-DD") || null,
        total_price: totalPrice,
      };

      console.log("📦 Final postData:", postData);

      let response;
      if (isUpdate && postId) {
        // Nếu đang ở bước 1, chỉ cập nhật thông tin cơ bản
        if (step === 0) {
          const basicInfo = {
            email: values?.email || "",
            lastName: values?.textField || "",
            phone_number: values?.phone || "",
            room_name: values?.textInputTitle || "",
            description: values?.textInputNaiyo || "",
            price_per_month: Number(values?.price) || 0,
            type: values?.dropdown || "",
            area: Number(values?.erea) || 0,
          };
          console.log("📝 Updating basic info:", basicInfo);
          response = await PostRentUpdate(postId, basicInfo);
        }
        // Nếu đang ở bước 2, cập nhật thông tin ảnh
        else if  (step === 1) { 
          const images = values?.images || [];
          console.log("📸 Raw images from form:", images);
      
          let room_images = [];
      
          if (Array.isArray(images)) {
              room_images = images
                  .map((img) => {
                      console.log("🖼️ Processing image:", img);
                      if (img instanceof File) {
                          console.log("📄 File object:", img.name);
                          return img.name;
                      }
                      if (typeof img === "string") {
                          console.log("📝 String image:", img);
                          return img;
                      }
                      if (img && img.name) {
                          console.log("📋 Object with name:", img.name);
                          return img.name;
                      }
                      return "";
                  })
                  .filter((name) => name);
              
          }
      
          const imageInfo = { room_images };
          console.log("🖼️ Updating image info:", imageInfo);
          response = await PostRentUpdate(postId, imageInfo);
      }      
        // Nếu đang ở bước 3, cập nhật thông tin thanh toán
        else if (step === 2) {
          const paymentInfo = {
            total_price: totalPrice || 0,
            start_date: startDate?.format("YYYY-MM-DD") || null,
            expire: endDate?.format("YYYY-MM-DD") || null,
          };
          console.log("💰 Updating payment info:", paymentInfo);
          response = await PostRentUpdate(postId, paymentInfo);
        }
      } else {
        // Tạo mới bài đăng
        console.log("✨ Creating new post with data:", postData);
        response = await PostRentCreate(postData);
        if (response && response.success) {
          console.log(
            "✅ Post created successfully with ID:",
            response.data.post.id
          );
          setPostId(response.data.post.id);
        }
      }

      if (response && response.success) {
        console.log("✅ API Response:", response);
        return true;
      } else {
        console.error("❌ API Error:", response);
        return false;
      }
    } catch (error) {
      console.error(
        isUpdate ? "Failed to update post: " : "Failed to create post: ",
        error
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const increase = useCallback(async () => {
    try {
      setIsLoading(true);
      const isValid = await trigger(`step${step}`);
      const values = getValues() || {};

      if (step === 0) {
        const requiredFields = {
          dropdown: values?.dropdown,
          erea: values?.erea,
          price: values?.price,
          email: values?.email,
          phone: values?.phone,
          textInputTitle: values?.textInputTitle,
          textInputNaiyo: values?.textInputNaiyo,
        };

        const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          console.log("Missing fields:", missingFields);
          return;
        }

        await handlePostData(values, !!postId);
      } else if (step === 1) {
        // const images = values?.images || [];
        // if (!images || images.length < 3) {
        //   // // toast.error("Vui lòng tải lên ít nhất 3 ảnh!", {
        //   // //   position: "top-right",
        //   // //   autoClose: 3000,
        //   // });
        //   return;
        // // }
        // if (images.length > 15) {
        //   toast.error("Chỉ được tải lên tối đa 15 ảnh!", {
        //     position: "top-right",
        //     autoClose: 3000,
        //   });
        //   return;
        // }
        await handlePostData(values, true);
      } else if (step === 2) {
        // if (Number(totalPrice) === 0) {
        //   toast.error("Vui lòng chọn loại tin và thời gian đăng tin!", {
        //     position: "top-right",
        //     autoClose: 3000,
        //   });
        //   return;
        // }
        await handlePostData(values, true);
      } else if (step === 3) {
        try {
          const values = getValues() || {};
          const amountNumber =
            typeof totalPrice === "string"
              ? Number(totalPrice.replace(/[.,]/g, ""))
              : totalPrice;
          const orderInfo =
            values?.textField !== null ? String(values.textField) : "nội dung";

          const response = await paymentApi.paymentVnpay({
            amount: amountNumber,
            orderInfo: orderInfo,
          });

          if (response.data && response.data.paymentUrl) {
            setPayUrl(response.data.paymentUrl);
            window.location.href = response.data.paymentUrl;
          } else {
            // // toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!", {
            // //   position: "top-right",
            // //   autoClose: 3000,
            // });
          }
        } catch (error) {
          console.error("❌ Lỗi khi tạo URL thanh toán:", error);
          // // toast.error("Lỗi khi tạo thanh toán. Vui lòng thử lại!", {
          // //   position: "top-right",
          // //   autoClose: 3000,
          // });
        }
        return;
      }

      if (step < steps.length - 1) {
        setStep((prev) => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, [step, steps.length, postId, totalPrice, trigger, errors, getValues]);

  const decline = useCallback(() => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  if (!Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  return (
    <Flex vertical gap="medium">
      {/* <ToastContainer /> */}
      <Progress
        percent={(step / (steps.length - 1)) * 100}
        type="line"
        showInfo={false}
      />

      <div key={`step-${step}`}>
        {Array.isArray(steps) && steps[step] && <div>{steps[step]}</div>}
      </div>

      <Space className="flex justify-between mt-11 py-11 space-x-6">
        <Button
          onClick={decline}
          disabled={step === 0 || isLoading}
          className="text-lg font-semibold rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 h-12 w-35"
        >
          Quay lại
        </Button>

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
                disabled={Number(totalPrice) === 0 || isLoading}
                className={`text-lg font-semibold rounded-full h-12 w-35
                  ${
                    Number(totalPrice) === 0
                      ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                      : "bg-[#4caf4f] text-white"
                  }
                `}
              >
                Thanh toán
              </Button>
            </div>
          ) : (
            <Button
              onClick={increase}
              type="primary"
              disabled={isLoading}
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
