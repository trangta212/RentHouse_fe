import io from "socket.io-client";
import { getUserInfo } from "../api/userApi";

const SOCKET_URL = "http://localhost:8000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let onNewMessageCallback = null;
let userEmail = null;
let userToken = null;

export const initSocket = async () => {
  try {
    const userData = await getUserInfo();
    console.log("Raw user data from API:", userData);

    if (!userData) {
      console.error("No user data received from API");
      return null;
    }

    userEmail = userData.email || userData.user?.email || userData.data?.email;
    console.log("Extracted email:", userEmail);

    if (!userEmail) {
      console.error(
        "No email found in user data. Available fields:",
        Object.keys(userData)
      );
      return null;
    }

    userToken = sessionStorage.getItem("authToken");
    if (!userToken) {
      console.error("No token found in sessionStorage");
      return null;
    }

    socket.auth = { email: userEmail, token: userToken };
    socket.connect();

    // 🔁 Gửi authenticate khi kết nối lần đầu hoặc reconnect
    const sendAuth = () => {
      if (userEmail && userToken) {
        console.log("🔐 Sending authenticate after connect/reconnect");
        socket.emit("authenticate", { email: userEmail, token: userToken });
      }
    };

    socket.on("connect", () => {
      console.log("✅ Socket connected with ID:", socket.id);
      sendAuth();
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`🔁 Reconnected to server (attempt ${attemptNumber})`);
      sendAuth();
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    socket.on("receive_message", (message) => {
      console.log("📨 New message received:", message);
      if (onNewMessageCallback) {
        onNewMessageCallback(message);
      }
    });

    return socket;
  } catch (error) {
    console.error("❌ Error initializing socket:", error);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("⛔ Disconnecting socket");
    socket.disconnect();
  }
};

export const onNewMessage = (callback) => {
  onNewMessageCallback = callback;
};

export const sendMessage = async (receiverEmail, content) => {
  console.log("📩 Attempting to send message...");
  console.log("Receiver email:", receiverEmail);
  console.log("Message content:", content);
  
  if (socket.connected) {
    if (!socket.auth || !socket.auth.email || !socket.auth.token) {
      console.warn("Socket is not authenticated yet, retrying...");
      setTimeout(() => sendMessage(receiverEmail, content), 1000); // Retry after 1 second
      return;
    }
    console.log("✉️ Sending message to:", receiverEmail);
    socket.emit("send_message", { receiverEmail, content });
  } else {
    console.warn("🔌 Socket not connected, retrying...");
    try {
      const newSocket = await initSocket();
      if (newSocket?.connected) {
        console.log("✅ Reconnected, sending message...");
        socket.emit("send_message", { receiverEmail, content });
      }
    } catch (error) {
      console.error("❌ Failed to reconnect socket:", error);
    }
  }
};


export default socket;
