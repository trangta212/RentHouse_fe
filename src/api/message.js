import axiosInstance from "../untils/axiosInstance.js";
import socket from '../chat/socket';  // or the correct relative path


/**
 * Lấy danh sách các cuộc trò chuyện của người dùng hiện tại
 * @returns {Promise} Kết quả từ API
 */
export const getConversations = async () => {
  try {
    const response = await axiosInstance.get("/chat/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử tin nhắn giữa hai người dùng
 * @param {string} receiverEmail - Email của người nhận
 * @returns {Promise} Kết quả từ API
 */
export const getMessages = async (receiverEmail) => {
  try {
    const response = await axiosInstance.get("/chat/messages", {
      params: { receiverEmail },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Đánh dấu tin nhắn đã đọc
 * @param {string} senderEmail - Email của người gửi
 * @returns {Promise} Kết quả từ API
 */
export const markAsRead = async (senderEmail) => {
  try {
    const response = await axiosInstance.post("/chat/mark-as-read", {
      senderEmail,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

/**
 * Gửi tin nhắn qua API (backup cho socket)
 * @param {Object} messageData - Dữ liệu tin nhắn
 * @returns {Promise} Kết quả từ API
 */

export const sendMessage = (messageData) => {
  if (!socket.connected) {
    console.error("Socket is not connected");
    return;
  }

  // Gửi tin nhắn qua socket
  socket.emit("send_message", messageData, (response) => {
    // Xử lý phản hồi từ server (nếu có)
    if (response.success) {
      console.log("Message sent successfully:", response);
    } else {
      console.error("Failed to send message:", response.error);
    }
  });
};
