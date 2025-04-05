import io from "socket.io-client";
import { getUserInfo } from "../api/userApi";

const SOCKET_URL = "http://localhost:8000";

// Tạo một instance của Socket.IO client
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// Callback function để xử lý tin nhắn mới
let onNewMessageCallback = null;

// Khởi tạo kết nối với email
export const initSocket = async () => {
  try {
    // Lấy thông tin user từ API
    const userData = await getUserInfo();
    console.log("Raw user data from API:", userData);

    if (!userData) {
      console.error("No user data received from API");
      return null;
    }

    // Kiểm tra các trường có thể chứa email
    const email =
      userData.email || userData.user?.email || userData.data?.email;
    console.log("Extracted email:", email);

    if (!email) {
      console.error(
        "No email found in user data. Available fields:",
        Object.keys(userData)
      );
      return null;
    }

    // Thêm token vào socket auth
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in sessionStorage");
      return null;
    }

    console.log("Initializing socket with email:", email);
    socket.auth = { email, token };

    // Kết nối socket
    socket.connect();

    // Authenticate với server
    socket.emit("authenticate", { email, token });

    // Log kết nối thành công
    socket.on("connect", () => {
      console.log("Socket connected successfully with ID:", socket.id);
    });

    // Log lỗi kết nối
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Log khi ngắt kết nối
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // Lắng nghe tin nhắn mới
    socket.on("receive_message", (message) => {
      console.log("New message received from server:", message);
      if (onNewMessageCallback) {
        onNewMessageCallback(message);
      }
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;
  }
};

// Ngắt kết nối socket
export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("Disconnecting socket");
    socket.disconnect();
  }
};

// Lắng nghe tin nhắn mới
export const onNewMessage = (callback) => {
  onNewMessageCallback = callback;
};

// Gửi tin nhắn
export const sendMessage = async (receiverEmail, content) => {
  if (socket.connected) {
    console.log("Sending message to:", receiverEmail);
    console.log("Message content:", content);
    socket.emit("send_message", { receiverEmail, content });
  } else {
    console.error("Socket not connected");
    // Thử kết nối lại nếu chưa kết nối
    try {
      const newSocket = await initSocket();
      if (newSocket && newSocket.connected) {
        console.log("Socket reconnected, sending message...");
        socket.emit("send_message", { receiverEmail, content });
      }
    } catch (error) {
      console.error("Failed to reconnect socket:", error);
    }
  }
};

export default socket;
