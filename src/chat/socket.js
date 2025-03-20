import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  withCredentials: true, // Nếu cần gửi cookie
  transports: ["websocket"], // Giúp giảm độ trễ và lỗi polling
});

socket.on("connect", () => {
  console.log("🟢 Connected to server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected:", reason);
});

export default socket;