
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import moment from "moment";
import "moment/locale/vi";
import socket, { initSocket } from "./socket";
import { getMessages } from "../api/message"; // Giả định bạn có API lấy tin nhắn
import { getUserInfo } from "../api/userApi"; // Giả định bạn có API lấy thông tin user

const ChatBox = ({ currentUser, selectedChat,changebutton }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const [mail, setMail] = useState("");

  // Kiểm tra kết nối socket
  useEffect(() => {
    const checkSocketConnection = () => {
      if (socket.connected) {
        console.log("Socket is connected");
        setIsSocketConnected(true);
      } else {
        console.log("Socket is not connected, attempting to connect...");
        if (currentUser?.email) {
          const newSocket = initSocket(currentUser.email);
          setTimeout(() => {
            if (newSocket?.connected) {
            console.log("Socket reconnected successfully");
              setIsSocketConnected(true);
            } else {
              console.error("Failed to reconnect socket");
              setIsSocketConnected(false);
            }
          }, 1000);
        }
      }
    };

    // Kiểm tra kết nối khi component mount
    checkSocketConnection();

    // Lắng nghe sự kiện kết nối/ngắt kết nối
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log("Current User:", currentUser);
    console.log("Selected Chat:", selectedChat);
    console.log("Socket Connection Status:", isSocketConnected);

    const messageData = {
      receiverEmail: selectedChat?.email || changebutton,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message with data:", messageData);

    try {
      if (isSocketConnected) {
        console.log("Socket is connected, emitting message");
        socket.emit("send_message", messageData);
      } else {
        console.log("Socket is not connected, attempting to reconnect...");
        if (currentUser?.email) {
          const newSocket = initSocket(currentUser.email);
          setTimeout(() => {
            if (newSocket?.connected) {
              console.log("Socket reconnected, sending message");
              newSocket.emit("send_message", messageData);
            } else {
              console.error("Failed to reconnect socket");
              // TODO: Implement fallback to HTTP API if socket fails
            }
          }, 1000);
        }
      }

      // Add message to local state
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch messages when selectedChat changes

  useEffect(() => {
    if (!selectedChat) {
      console.log("No chat selected!");
      return; // Nếu không có chat được chọn, không làm gì cả
    }
    console.log("Dung testtest:", selectedChat);
    const fetchMessages = async () => {
      try {
        const response = await getMessages(selectedChat?.email); // Gọi API để lấy tin nhắn
        console.log("Fetched messages:", response);
        if (response.success) {
          setMessages(response.messages); // Cập nhật state với tin nhắn mới
        } else {  
          console.error("Failed to fetch messages:", response.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [ selectedChat]); // Gọi lại khi selectedChat thay đổi

  useEffect (() => {
    const fetchChangeButton = async () => {
      try {
        const response = await getMessages(changebutton); 
        console.log("Fetched messages:", response);
        if (response.success) {
          setMessages(response.messages); // Cập nhật state với tin nhắn mới
        } else {  
          console.error("Failed to fetch messages:", response.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchChangeButton();
  }, [ changebutton]); 
        


  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {(selectedChat || changebutton) ? (
        <>
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Avatar
              src={selectedChat.avatar}
              sx={{ width: 40, height: 40, mr: 2 }}
            /> */}
            <Box>
              {/* <Typography variant="h6">{selectedChat.userName || changebutton}</Typography> */}
              <Typography variant="body2" color="text.secondary">
                {isSocketConnected ? "Đã kết nối" : "Đang kết nối lại..."}
              </Typography>
            </Box>
          </Box>

          {/* Messages container */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf:
                    message.senderEmail === currentUser?.email
                      ? "flex-end"
                      : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor:
                      message.senderEmail === currentUser?.email
                        ? "#588157"
                        : "#e8f5e9",
                    color:
                      message.senderEmail === currentUser?.email
                        ? "red"
                        : "inherit",
                  }}
                >
                  <Typography>{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      mt: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    {moment(message.timestamp).fromNow()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message input */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{ mr: 1 }}
              disabled={!isSocketConnected}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isSocketConnected}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;