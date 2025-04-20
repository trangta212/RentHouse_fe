import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import SideBar from "./sidebar";
import ChatBox from "./mainchat";
import  socket from "./socket"; // Sử dụng socket đã được khởi tạo
import { useAuth } from "../context/authContext"; // Lấy user từ context nếu có
import { getUserInfo } from "../api/userApi"; // Giả định bạn có API lấy thông tin user

const Chat = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [changebutton, setChangeButton] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  

  // Nhận thông tin sender từ location state (khi chuyển từ trang chi tiết phòng)
  useEffect(() => {
    if (location.state?.sender) {
      setSelectedChat(location.state.sender);
    }
  }, [location]);
useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log("User info fetched:", userInfo);
        setCurrentUser(userInfo.data.email);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }
, []);
  
  // Lắng nghe sự kiện kết nối socket
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup khi component unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Handler khi chọn một cuộc trò chuyện từ sidebar
  const handleSelectChat = (email) => {
    setChangeButton(email);
  };

  return (
    <Paper
      square
      elevation={0}
      sx={{ height: "100vh", display: "flex", overflow: "hidden" }}
    >
      <SideBar
        onSelectChat={handleSelectChat}
        isSocketConnected={isSocketConnected}
      />
      <ChatBox
        currentUser={currentUser}
        selectedChat={selectedChat}
        changebutton={changebutton}
      />
    </Paper>
  );
};

export default Chat;
