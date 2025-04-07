import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import SideBar from "./sidebar";
import ChatBox from "./mainchat";
import { initSocket, disconnectSocket } from "./socket";
import { getUserInfo } from "../api/userApi"; // Giả định bạn có API lấy thông tin user

const Chat = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [changebutton, setChangeButton] = useState(false);

  // Nhận thông tin sender từ location state (khi chuyển từ trang chi tiết phòng)
  useEffect(() => {
    if (location.state?.sender) {
      setSelectedChat(location.state.sender);
    }
  }, [location]);

  // Lấy thông tin người dùng hiện tại và khởi tạo socket
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log("User info fetched:", userInfo); 
          setCurrentUserEmail(userInfo.data.email);
          setCurrentUser(userInfo.data.email);
          console.log("Index.js - currentUser set to:", userInfo.data.email);
        const socket = await initSocket(userInfo.data.email);
        if (socket) {
          setIsSocketConnected(true);
          socket.on("connect", () => {
            setIsSocketConnected(true);
          });
          socket.on("disconnect", () => {
            setIsSocketConnected(false);
          });
        }
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initializeSocket();

    // Cleanup khi component unmount
    return () => {
      disconnectSocket();
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
        // selectedChat={selectedChat}
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
