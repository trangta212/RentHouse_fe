import { create } from "zustand";
import io from "socket.io-client";
import { getUserInfo } from "../api/userApi";

const SOCKET_URL = "http://localhost:8000";

const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
  error: null,
  currentUserEmail: null,

  // Khởi tạo socket
  initializeSocket: async () => {
    try {
      // Lấy token từ sessionStorage
      const token = sessionStorage.getItem("authToken");
      console.log("Token from sessionStorage:", token);

      if (!token) {
        throw new Error("No token found in sessionStorage");
      }

      // Lấy thông tin user
      const userData = await getUserInfo();
      console.log("User data from API:", userData);

      const email =
        userData.email || userData.user?.email || userData.data?.email;
      console.log("Extracted email:", email);

      if (!email) {
        throw new Error("No email found in user data");
      }

      // Lưu email của user hiện tại
      set({ currentUserEmail: email });

      // Tạo socket mới
      const socket = io(SOCKET_URL, {
        autoConnect: false,
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      // Kết nối socket
      socket.connect();

      // Đợi kết nối thành công
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 5000);

        socket.once("connect", () => {
          clearTimeout(timeout);
          console.log("Socket connected successfully");
          resolve();
        });

        socket.once("connect_error", (error) => {
          clearTimeout(timeout);
          console.error("Socket connection error:", error);
          reject(error);
        });
      });

      // Authenticate với server
      await new Promise((resolve, reject) => {
        console.log("Attempting to authenticate with server...");
        console.log("Auth data:", { email, token });

        socket.emit("authenticate", { email, token }, (response) => {
          console.log("Authentication response:", response);

          if (response && response.success) {
            console.log("Socket authenticated successfully");
            set({ isAuthenticated: true });
            resolve();
          } else {
            console.error("Authentication failed:", response?.message);
            set({ isAuthenticated: false });
            reject(new Error(response?.message || "Authentication failed"));
          }
        });
      });

      // Lưu socket và cập nhật trạng thái
      set({ socket, isConnected: true, error: null });

      // Lắng nghe các sự kiện
      socket.on("connect", () => {
        console.log("Socket connected");
        set({ isConnected: true });
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        set({ isConnected: false, isAuthenticated: false });
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        set({ error: error.message, isAuthenticated: false });
      });

      return socket;
    } catch (error) {
      console.error("Socket initialization error:", error);
      set({ error: error.message, isAuthenticated: false });
      throw error;
    }
  },

  // Ngắt kết nối socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, isAuthenticated: false });
    }
  },

  // Gửi tin nhắn
  sendMessage: async (receiverEmail, content) => {
    const { socket, isConnected, isAuthenticated, currentUserEmail } = get();

    if (!isConnected || !socket) {
      throw new Error("Socket not connected");
    }

    if (!isAuthenticated) {
      throw new Error("Socket not authenticated. Please authenticate first");
    }

    if (!currentUserEmail) {
      throw new Error("No sender email found");
    }

    return new Promise((resolve, reject) => {
      // Chỉ gửi receiverEmail và content như backend mong đợi
      const messageData = {
        receiverEmail,
        content,
      };

      console.log("Sending message:", messageData);

      // Lắng nghe các sự kiện phản hồi trước khi gửi
      const messageHandler = (data) => {
        console.log("Received message_sent event:", data);
        socket.off("message_sent", messageHandler);
        socket.off("message_error", errorHandler);
        resolve(data);
      };

      const errorHandler = (error) => {
        console.error("Received message_error event:", error);
        socket.off("message_sent", messageHandler);
        socket.off("message_error", errorHandler);
        reject(new Error(error));
      };

      socket.on("message_sent", messageHandler);
      socket.on("message_error", errorHandler);

      // Gửi tin nhắn
      socket.emit("send_message", messageData);

      // Timeout sau 5 giây nếu không nhận được phản hồi
      setTimeout(() => {
        socket.off("message_sent", messageHandler);
        socket.off("message_error", errorHandler);
        reject(new Error("Message sending timeout"));
      }, 5000);
    });
  },
}));

export default useSocketStore;
