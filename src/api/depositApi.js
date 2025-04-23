import axiosInstance from "../untils/axiosInstance.js";

export const createDeposit = async (fullData) => {
  try {
    console.log("📤 Data being sent:", fullData);

    // Gửi request đến API
    const response = await axiosInstance.post("/deposit/create-deposit", fullData);

    // Trả về toàn bộ response từ server
    console.log("✅ Deposit API response:", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with error:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server:", error.request);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};