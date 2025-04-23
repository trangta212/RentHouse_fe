import axiosInstance from "../untils/axiosInstance.js";

export const getListNotification = async () => {
    try {
      const response = await axiosInstance.get("notification/notifications");
      return response.data; // Trả về dữ liệu từ server nếu thành công
    }catch (error) {
      // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.message || "Unknown error"}`);
    
        // Nếu lỗi là do phòng đã tồn tại, bạn có thể xử lý riêng
        if (status === 409) {
          return { message: "Không tồn tại trong danh sách yêu thích" };
        }
      }
    
      // Ném lỗi nếu không xử lý được
      throw error;
    }
    }

export const getConfirmNotificationById = async (id) => {
    try {
      const response = await axiosInstance.put(`notification/confirm-rental/${id}`);
      return response.data; // Trả về dữ liệu từ server nếu thành công
    }catch (error) {
      // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.message || "Unknown error"}`);
    
        // Nếu lỗi là do phòng đã tồn tại, bạn có thể xử lý riêng
        if (status === 409) {
          return { message: "Không tồn tại trong danh sách yêu thích" };
        }
      }
      // Ném lỗi nếu không xử lý được
      throw error;
    }
}