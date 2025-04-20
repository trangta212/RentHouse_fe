import axiosInstance from "../untils/axiosInstance.js";

export const createDeposit = async (fullData) => {
    try {
      console.log("📤 Data being sent:", fullData);
  
      const response = await axiosInstance.post("/deposit/create-deposit", fullData);
  
      const { status, data } = response;
  
      // Kiểm tra success và lấy dữ liệu từ data
      if (status === 200 && data?.success) {
        console.log("✅ Deposit API response:", data);
        return data.data; // Lấy thông tin deposit, user, notification từ data
      } else {
        console.error("❌ Deposit API failed:", data?.message || "Unknown error");
        return null;
      }
    } catch (error) {
      if (error.response) {
        console.error("❌ Server responded with error:", error.response.data);
      } else if (error.request) {
        console.error("❌ No response from server:", error.request);
      } else {
        console.error("❌ Unexpected error:", error.message);
      }
      return null;
    }
  };
  
