import axiosInstance from "../untils/axiosInstance.js";
export const createContract = async (notification_id, action) => {
    try {
      const response = await axiosInstance.post(`contract/`, { notification_id,action });
      return response.data; // Trả về dữ liệu từ server nếu thành công
    } catch (error) {
      // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.message || "Unknown error"}`);
    
        // Nếu lỗi là do phòng đã tồn tại, bạn có thể xử lý riêng
        if (status === 409) {
          return { message: "Không tồn tại" };
        }
      }
      // Ném lỗi nếu không xử lý được
      throw error;
    }
}
