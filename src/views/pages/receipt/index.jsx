// // import React, { useRef, useEffect, useState } from "react";
// // import { Divider, Button, Result } from "antd";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import paymentApi from "../../../api/paymentApi";
// // import { PostRentUpdate } from "../../../api/postRent";
// // import { createDeposit } from "../../../api/depositApi.js";

// // const ReceiptPage = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [paymentStatus, setPaymentStatus] = useState(null);
// //   const [paymentData, setPaymentData] = useState(null);
// //   const isProcessedRef = useRef(false); // Giữ trạng thái đã xử lý


// //   useEffect(() => {
// //     const handlePaymentResponse = async () => {
// //       if (isProcessedRef.current) return;
// //       isProcessedRef.current = true;
// //       try {
// //         // Lấy thông tin từ URL
// //         const searchParams = new URLSearchParams(location.search);
// //         const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
// //         const vnp_TxnRef = searchParams.get("vnp_TxnRef");
// //         const vnp_Amount = searchParams.get("vnp_Amount");
// //         const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
// //         const vnp_PayDate = searchParams.get("vnp_PayDate");
// //         const paymentMethod = searchParams.get("vnp_BankCode");
// //         const postId = searchParams.get("postId"); // Lấy postId từ URL

// //         // Kiểm tra kết quả thanh toán
// //         if (vnp_ResponseCode === "00") { 
// //           // Thanh toán thành công
// //           setPaymentStatus("success");
// //           setPaymentData({
// //             code: vnp_TxnRef,
// //             amount: Number(vnp_Amount) / 100, // Chuyển đổi từ VND sang đơn vị
// //             orderInfo: vnp_OrderInfo,
// //             payDate: vnp_PayDate,
// //             menthod: paymentMethod,
// //           });

// //           // Cập nhật trạng thái post thành active
// //           if (postId) {
// //             try {
// //               await PostRentUpdate(postId, {
// //                 status: "active",
// //               });
// //               console.log("Post status updated successfully");
// //             } catch (updateError) {
// //               console.error("Error updating post status:", updateError);
// //               // Không throw error ở đây để không ảnh hưởng đến trải nghiệm người dùng
// //             }
// //           }
// //           const depositDataStr = localStorage.getItem("depositData");
// //           const storedFileListStr = localStorage.getItem("fileList");
          
// //           if (depositDataStr && storedFileListStr) {
// //             try {
// //               const depositData = JSON.parse(depositDataStr);
// //               const storedFileList = JSON.parse(storedFileListStr);
          
// //               const fullData = {
// //                 ...depositData,
// //                 // cccd_images: storedFileList.map(file => file.originFileObj),
// //               };
          
// //               console.log("🔁 Thông tin gửi đi sau thanh toán:", fullData);
        
// //               try {
// //                 const deposit = await createDeposit(fullData);
// //                 console.log("Deposit created successfully:", deposit.success);
// //               } catch (error) {
// //                 console.error("Lỗi khi tạo deposit:", error);
// //               }

// //               // ✅ Xóa sau khi xử lý thành công
// //               // localStorage.removeItem("depositData");
// //               // localStorage.removeItem("fileList");
// //             } catch (parseError) {
// //               console.error("❌ Lỗi khi parse dữ liệu localStorage:", parseError);
// //             }
// //           } else {
// //             console.warn("⚠️ Không tìm thấy dữ liệu trong localStorage!");
// //           }
// //         } else {
// //           // Thanh toán thất bại
// //           setPaymentStatus("error");

// //           // Cập nhật trạng thái post thành failed nếu có postId
// //           if (postId) {
// //             try {
// //               await PostRentUpdate(postId, {
// //                 status: "pending",
// //               });
// //             } catch (updateError) {
// //               console.error("Error updating post status:", updateError);
// //             }
// //           }
// //         }

// //         // Gọi API để cập nhật trạng thái thanh toán
// //         await paymentApi.paymentReturn();
// //       } catch (error) {
// //         console.error("Error handling payment response:", error);
// //         setPaymentStatus("error");
// //       }
// //     };

// //     handlePaymentResponse();
// //   }, [location]);

// //   const handleHomeClick = () => {
// //     navigate("/user/home");
// //   };

// //   const handleManagePosts = () => {
// //     navigate("/manage-posts");
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "";
// //     return `${dateString.slice(0, 4)}-${dateString.slice(
// //       4,
// //       6
// //     )}-${dateString.slice(6, 8)}`;
// //   };

// //   if (paymentStatus === "error") {
// //     return (
// //       <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
// //         <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
// //           <div className="flex flex-col items-center mt-5">
// //             <div className="h-[13%] w-[10%] mt-12">
// //               <img
// //                 src={require("../../../assets/images/error-icon.png")}
// //                 alt="images"
// //                 className="imagesland"
// //                 style={{ width: "100%", height: "auto" }}
// //               />
// //             </div>
// //             <h1 className="text-[#3C5E39] font-bold text-2xl mt-7">
// //               Thanh toán không thành công
// //             </h1>
// //             <h2 className="text-slate-600 font-semibold mt-6 text-xl">
// //               Đã có lỗi xảy ra trong quá trình thanh toán
// //             </h2>
// //             <h2 className="text-slate-600 font-semibold mt-3 text-xl">
// //               Vui lòng thử lại sau
// //             </h2>
// //           </div>
// //           <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-20">
// //             <Button
// //               onClick={handleHomeClick}
// //               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
// //             >
// //               Quay về trang chủ
// //             </Button>
// //             <Button
// //               onClick={handleManagePosts}
// //               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
// //             >
// //               Quản lý tin đăng
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!paymentStatus || paymentStatus === "success") {
// //     return (
// //       <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
// //         <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
// //           <div className="flex flex-col items-center mt-5">
// //             <div className="h-[13%] w-[10%] mt-12">
// //               <img
// //                 src={require("../../../assets/images/check.png")}
// //                 alt="images"
// //                 className="imagesland"
// //                 style={{ width: "100%", height: "auto" }}
// //               />
// //             </div>
// //             <h1 className="text-[#3C5E39] font-semibold text-2xl mt-7">
// //               Thanh toán thành công
// //             </h1>
// //             <h2 className="text-[#617C5F] font-semibold mt-3 text-3xl">
// //               {paymentData?.amount?.toLocaleString()} đ
// //             </h2>
// //           </div>
// //           <Divider />
// //           <div className="mt-3 ml-[10%] mr-[10%]">
// //             <div className="flex justify-between text-base mt-1 text-[17px]">
// //               <span>Mã thanh toán</span>
// //               <span className="font-semibold text-gray-800 text-[17px]">
// //                 {paymentData?.code || "11458523"}
// //               </span>
// //             </div>
// //             <div className="flex justify-between text-base mt-2 text-[17px]">
// //               <span>Thời gian thanh toán</span>
// //               <span className="font-semibold text-gray-800 text-[17px]">
// //                 {formatDate(paymentData?.payDate)}
// //               </span>
// //             </div>
// //             <div className="flex justify-between text-base mt-2 text-[17px]">
// //               <span>Phương thức thanh toán</span>
// //               <span className="font-semibold text-gray-800 text-[17px]">
// //                 {paymentData?.menthod || "VNPAY"}
// //               </span>
// //             </div>
// //             <div className="flex items-center text-base mt-2 text-[17px]">
// //   <span style={{ flexBasis: "40%" }}>Nội dung thanh toán</span>
// //   <span
// //     className="font-semibold text-gray-800 text-[17px] truncate"
// //     style={{
// //       flexBasis: "60%", 
// //       display: "inline-block",
// //       whiteSpace: "nowrap", 
// //       overflow: "hidden", 
// //       textOverflow: "ellipsis", 
// //     }}
// //   >
// //     {paymentData?.orderInfo || "Thanh toán tiền đăng tin"}
// //   </span>
// // </div>
// //           </div>
// //           <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-10">
// //             <Button
// //               onClick={handleHomeClick}
// //               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
// //             >
// //               Quay về trang chủ
// //             </Button>
// //             <Button
// //               onClick={handleManagePosts}
// //               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
// //             >
// //               Quản lý tin đăng
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return null;
// // };

// // export default ReceiptPage;
// import React, { useRef, useEffect, useState } from "react";
// import { Divider, Button } from "antd";
// import { useNavigate, useLocation } from "react-router-dom";
// import paymentApi from "../../../api/paymentApi";
// import { PostRentUpdate } from "../../../api/postRent";
// import { createDeposit } from "../../../api/depositApi.js";

// const ReceiptPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [paymentData, setPaymentData] = useState(null);
//   const isProcessedRef = useRef(false);

//   useEffect(() => {
//     const handlePaymentResponse = async () => {
//       if (isProcessedRef.current) return;
//       isProcessedRef.current = true;

//       try {
//         const searchParams = new URLSearchParams(location.search);
//         const postId = searchParams.get("postId");
//         let orderInfoFromStorage;

//         // Lấy orderInfo từ localStorage nếu có
//         const depositDataStr = localStorage.getItem("depositData");
//         if (depositDataStr) {
//           try {
//             const depositData = JSON.parse(depositDataStr);
//             orderInfoFromStorage = depositData.orderInfo;
//           } catch (parseError) {
//             console.error("Lỗi parse depositData:", parseError);
//           }
//         }

//         // Kiểm tra phương thức thanh toán
//         if (searchParams.get("vnp_ResponseCode")) {
//           // Xử lý VNPay
//           const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
//           const vnp_TxnRef = searchParams.get("vnp_TxnRef");
//           const vnp_Amount = searchParams.get("vnp_Amount");
//           const vnp_OrderInfo = searchParams.get("vnp_OrderInfo") || orderInfoFromStorage;
//           const vnp_PayDate = searchParams.get("vnp_PayDate");
//           const paymentMethod = searchParams.get("vnp_BankCode");

//           if (vnp_ResponseCode === "00") {
//             setPaymentStatus("success");
//             setPaymentData({
//               code: vnp_TxnRef,
//               amount: Number(vnp_Amount) / 100,
//               orderInfo: vnp_OrderInfo,
//               payDate: vnp_PayDate,
//               method: paymentMethod || "VNPAY",
//             });

//             // Cập nhật trạng thái post
//             if (postId) {
//               try {
//                 await PostRentUpdate(postId, { status: "active" });
//                 console.log("Post status updated successfully");
//               } catch (updateError) {
//                 console.error("Error updating post status:", updateError);
//               }
//             }

//             // Tạo deposit
//             await handleDepositCreation(depositDataStr);
//           } else {
//             setPaymentStatus("error");
//             if (postId) {
//               try {
//                 await PostRentUpdate(postId, { status: "pending" });
//               } catch (updateError) {
//                 console.error("Error updating post status:", updateError);
//               }
//             }
//           }

//           // Gọi API xác nhận VNPay
//           await paymentApi.paymentReturn();
//         } else if (searchParams.get("resultCode")) {
//           // Xử lý MoMo
//           const resultCode = searchParams.get("resultCode");
//           const orderId = searchParams.get("orderId");
//           const amount = searchParams.get("amount");
//           const responseTime = searchParams.get("responseTime");
//           const partnerCode = searchParams.get("partnerCode");
//           const orderInfo = orderInfoFromStorage || "Thanh toán tiền đăng tin";

//           if (resultCode === "0") {
//             setPaymentStatus("success");
//             setPaymentData({
//               code: orderId,
//               amount: Number(amount),
//               orderInfo: orderInfo,
//               payDate: responseTime,
//               method: partnerCode || "MOMO",
//             });

//             // Cập nhật trạng thái post
//             if (postId) {
//               try {
//                 await PostRentUpdate(postId, { status: "active" });
//                 console.log("Post status updated successfully");
//               } catch (updateError) {
//                 console.error("Error updating post status:", updateError);
//               }
//             }

//             // Tạo deposit
//             await handleDepositCreation(depositDataStr);
//           } else {
//             setPaymentStatus("error");
//             if (postId) {
//               try {
//                 await PostRentUpdate(postId, { status: "pending" });
//               } catch (updateError) {
//                 console.error("Error updating post status:", updateError);
//               }
//             }
//           }

//           // TODO: Gọi API xác nhận MoMo nếu cần
//           // await paymentApi.momoPaymentReturn(); // Tạo API nếu MoMo yêu cầu xác nhận
//         } else {
//           setPaymentStatus("error");
//         }
//       } catch (error) {
//         console.error("Error handling payment response:", error);
//         setPaymentStatus("error");
//       }
//     };

//     // Hàm xử lý tạo deposit
//     const handleDepositCreation = async (depositDataStr) => {
//       const storedFileListStr = localStorage.getItem("fileList");
//       if (depositDataStr && storedFileListStr) {
//         try {
//           const depositData = JSON.parse(depositDataStr);
//           const storedFileList = JSON.parse(storedFileListStr);

//           const fullData = {
//             ...depositData,
//             // cccd_images: storedFileList.map(file => file.originFileObj),
//           };

//           console.log("🔁 Thông tin gửi đi sau thanh toán:", fullData);

//           try {
//             const deposit = await createDeposit(fullData);
//             console.log("Deposit created successfully:", deposit.success);
//           } catch (error) {
//             console.error("Lỗi khi tạo deposit:", error);
//           }

//           // Xóa localStorage sau khi xử lý
//           // localStorage.removeItem("depositData");
//           // localStorage.removeItem("fileList");
//         } catch (parseError) {
//           console.error("❌ Lỗi khi parse dữ liệu localStorage:", parseError);
//         }
//       } else {
//         console.warn("⚠️ Không tìm thấy dữ liệu trong localStorage!");
//       }
//     };

//     handlePaymentResponse();
//   }, [location]);

//   const handleHomeClick = () => {
//     navigate("/user/home");
//   };

//   const handleManagePosts = () => {
//     navigate("/manage-posts");
//   };

//   const formatDate = (dateValue) => {
//     if (!dateValue) return "";
//     if (typeof dateValue === "string" && dateValue.length >= 8) {
//       // VNPay format: YYYYMMDD
//       return `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;
//     } else if (typeof dateValue === "number") {
//       // MoMo format: timestamp
//       const date = new Date(dateValue);
//       return date.toISOString().slice(0, 10); // YYYY-MM-DD
//     }
//     return "";
//   };

//   if (paymentStatus === "error") {
//     return (
//       <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
//         <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
//           <div className="flex flex-col items-center mt-5">
//             <div className="h-[13%] w-[10%] mt-12">
//               <img
//                 src={require("../../../assets/images/error-icon.png")}
//                 alt="images"
//                 className="imagesland"
//                 style={{ width: "100%", height: "auto" }}
//               />
//             </div>
//             <h1 className="text-[#3C5E39] font-bold text-2xl mt-7">
//               Thanh toán không thành công
//             </h1>
//             <h2 className="text-slate-600 font-semibold mt-6 text-xl">
//               Đã có lỗi xảy ra trong quá trình thanh toán
//             </h2>
//             <h2 className="text-slate-600 font-semibold mt-3 text-xl">
//               Vui lòng thử lại sau
//             </h2>
//           </div>
//           <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-20">
//             <Button
//               onClick={handleHomeClick}
//               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
//             >
//               Quay về trang chủ
//             </Button>
//             <Button
//               onClick={handleManagePosts}
//               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
//             >
//               Quản lý tin đăng
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!paymentStatus || paymentStatus === "success") {
//     return (
//       <div className="bg-[#D2DDBF] p-4 flex flex-col items-center">
//         <div className="h-screen w-[60%] mt-7 mb-8 bg-white border rounded-[20px] p-6">
//           <div className="flex flex-col items-center mt-5">
//             <div className="h-[13%] w-[10%] mt-12">
//               <img
//                 src={require("../../../assets/images/check.png")}
//                 alt="images"
//                 className="imagesland"
//                 style={{ width: "100%", height: "auto" }}
//               />
//             </div>
//             <h1 className="text-[#3C5E39] font-semibold text-2xl mt-7">
//               Thanh toán thành công
//             </h1>
//             <h2 className="text-[#617C5F] font-semibold mt-3 text-3xl">
//               {paymentData?.amount?.toLocaleString()} đ
//             </h2>
//           </div>
//           <Divider />
//           <div className="mt-3 ml-[10%] mr-[10%]">
//             <div className="flex justify-between text-base mt-1 text-[17px]">
//               <span>Mã thanh toán</span>
//               <span className="font-semibold text-gray-800 text-[17px]">
//                 {paymentData?.code || "N/A"}
//               </span>
//             </div>
//             <div className="flex justify-between text-base mt-2 text-[17px]">
//               <span>Thời gian thanh toán</span>
//               <span className="font-semibold text-gray-800 text-[17px]">
//                 {formatDate(paymentData?.payDate)}
//               </span>
//             </div>
//             <div className="flex justify-between text-base mt-2 text-[17px]">
//               <span>Phương thức thanh toán</span>
//               <span className="font-semibold text-gray-800 text-[17px]">
//                 {paymentData?.method || "N/A"}
//               </span>
//             </div>
//             <div className="flex items-center text-base mt-2 text-[17px]">
//               <span style={{ flexBasis: "40%" }}>Nội dung thanh toán</span>
//               <span
//                 className="font-semibold text-gray-800 text-[17px] truncate"
//                 style={{
//                   flexBasis: "60%",
//                   display: "inline-block",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {paymentData?.orderInfo || "Thanh toán tiền đăng tin"}
//               </span>
//             </div>
//           </div>
//           <div className="flex justify-between ml-[5%] mr-[5%] mb-12 mt-10">
//             <Button
//               onClick={handleHomeClick}
//               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
//             >
//               Quay về trang chủ
//             </Button>
//             <Button
//               onClick={handleManagePosts}
//               className="bg-[#4caf4f] text-white p-5 text-base border rounded-[20px] hover:bg-[#45a049]"
//             >
//               Quản lý tin đăng
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default ReceiptPage;
import React, { useRef, useEffect, useState } from "react";
import { Divider, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import paymentApi from "../../../api/paymentApi";
import { PostRentUpdate } from "../../../api/postRent";
import { createDeposit } from "../../../api/depositApi.js";

const ReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const isProcessedRef = useRef(false);

  useEffect(() => {
    const handlePaymentResponse = async () => {
      if (isProcessedRef.current) return;
      isProcessedRef.current = true;

      try {
        const searchParams = new URLSearchParams(location.search);
        let postId = searchParams.get("postId");
        let orderInfoFromStorage;

        // Lấy orderInfo và postId từ localStorage nếu có
        const depositDataStr = localStorage.getItem("depositData");
        if (depositDataStr) {
          try {
            const depositData = JSON.parse(depositDataStr);
            orderInfoFromStorage = depositData.orderInfo;
            postId = postId || depositData.postId;
          } catch (parseError) {
            console.error("Lỗi parse depositData:", parseError);
          }
        }

        // Xử lý extraData từ MoMo (nếu có)
        const extraData = searchParams.get("extraData");
        if (extraData) {
          try {
            const decodedExtraData = JSON.parse(Buffer.from(extraData, "base64").toString());
            postId = postId || decodedExtraData.postId;
          } catch (decodeError) {
            console.error("Lỗi decode extraData:", decodeError);
          }
        }

        // Kiểm tra phương thức thanh toán
        if (searchParams.get("vnp_ResponseCode")) {
          // Xử lý VNPay
          const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
          const vnp_TxnRef = searchParams.get("vnp_TxnRef");
          const vnp_Amount = searchParams.get("vnp_Amount");
          const vnp_OrderInfo = searchParams.get("vnp_OrderInfo") || orderInfoFromStorage;
          const vnp_PayDate = searchParams.get("vnp_PayDate");
          const paymentMethod = searchParams.get("vnp_BankCode");

          if (vnp_ResponseCode === "00") {
            setPaymentStatus("success");
            setPaymentData({
              code: vnp_TxnRef,
              amount: Number(vnp_Amount) / 100,
              orderInfo: vnp_OrderInfo,
              payDate: vnp_PayDate,
              method: paymentMethod || "VNPAY",
            });

            if (postId) {
              try {
                await PostRentUpdate(postId, { status: "active" });
                console.log("Post status updated successfully");
              } catch (updateError) {
                console.error("Error updating post status:", updateError);
              }
            }

            await handleDepositCreation(depositDataStr);
          } else {
            setPaymentStatus("error");
            if (postId) {
              try {
                await PostRentUpdate(postId, { status: "pending" });
              } catch (updateError) {
                console.error("Error updating post status:", updateError);
              }
            }
          }

          await paymentApi.paymentReturn();
        } else if (searchParams.get("resultCode")) {
          // Xử lý MoMo
          try {
            // Gọi API để xác thực MoMo
            const response = await paymentApi.paymentReturnByMomo(location.search);
            const { status, message, data } = response.data;

            if (status === "success") {
              setPaymentStatus("success");
              setPaymentData({
                code: data.orderId,
                amount: data.amount,
                orderInfo: data.orderInfo || orderInfoFromStorage || "Thanh toán tiền đăng tin",
                payDate: data.responseTime,
                method: searchParams.get("partnerCode") || "MOMO",
              });

              if (data.postId || postId) {
                try {
                  await PostRentUpdate(data.postId || postId, { status: "active" });
                  console.log("Post status updated successfully");
                } catch (updateError) {
                  console.error("Error updating post status:", updateError);
                }
              }

              await handleDepositCreation(depositDataStr);
            } else {
              setPaymentStatus("error");
              if (data.postId || postId) {
                try {
                  await PostRentUpdate(data.postId || postId, { status: "pending" });
                } catch (updateError) {
                  console.error("Error updating post status:", updateError);
                }
              }
            }
          } catch (apiError) {
            console.error("Lỗi gọi API MoMo return:", apiError);
            setPaymentStatus("error");
            if (postId) {
              try {
                await PostRentUpdate(postId, { status: "pending" });
              } catch (updateError) {
                console.error("Error updating post status:", updateError);
              }
            }
          }
        } else {
          setPaymentStatus("error");
        }
      } catch (error) {
        console.error("Error handling payment response:", error);
        setPaymentStatus("error");
      }
    };

    const handleDepositCreation = async (depositDataStr) => {
      const storedFileListStr = localStorage.getItem("fileList");
      if (depositDataStr && storedFileListStr) {
        try {
          const depositData = JSON.parse(depositDataStr);
          const storedFileList = JSON.parse(storedFileListStr);

          const fullData = {
            ...depositData,
            // cccd_images: storedFileList.map(file => file.originFileObj),
          };

          console.log("🔁 Thông tin gửi đi sau thanh toán:", fullData);

          try {
            const deposit = await createDeposit(fullData);
            console.log("Deposit created successfully:", deposit.success);
            if (deposit.success) {
              localStorage.removeItem("depositData");
              localStorage.removeItem("fileList");
            }
          } catch (error) {
            console.error("Lỗi khi tạo deposit:", error);
          }
        } catch (parseError) {
          console.error("❌ Lỗi khi parse dữ liệu localStorage:", parseError);
        }
      } else {
        console.warn("⚠️ Không tìm thấy dữ liệu trong localStorage!");
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

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    if (typeof dateValue === "string" && dateValue.length >= 8) {
      return `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;
    } else if (typeof dateValue === "number") {
      const date = new Date(Number(dateValue));
      return date.toISOString().slice(0, 10);
    }
    return "";
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
                {paymentData?.code || "N/A"}
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
                {paymentData?.method || "N/A"}
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