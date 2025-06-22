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


const ChatBox = ({ currentUser, selectedChat, changebutton }) => {
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
        if (currentUser) {
          const newSocket = initSocket(currentUser);
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

    checkSocketConnection();

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
    });

    // Lắng nghe sự kiện nhận tin nhắn mới
    //
    socket.on("receive_message", (newMessage) => {
      console.log("Received new message:", newMessage);
      console.log("Current User:", currentUser); // In ra giá trị currentUser
      console.log("Sender Email:", newMessage.senderEmail); // In ra giá trị senderEmail của tin nhắn
      console.log("Received new message:", newMessage);
      // Kiểm tra điều kiện đúng để thêm tin nhắn vào chat hiện tại
      if (
        newMessage.senderEmail === selectedChat?.email ||
        newMessage.senderEmail === changebutton ||
        newMessage.receiverEmail === currentUser
      ) {
        console.log("Adding message to current chat:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Lắng nghe sự kiện tin nhắn đã gửi thành công
    socket.on("message_sent", (sentMessage) => {
      console.log("Message sent successfully:", sentMessage);
      // Chỉ thêm tin nhắn vào khi tin nhắn đã được gửi thành công
      if (sentMessage.receiverEmail === currentUser) {
        console.log("Adding sent message to local state:", sentMessage);
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, [selectedChat, changebutton, currentUser]);

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
    };

    console.log("Sending message with data:", messageData);

    try {
      if (isSocketConnected) {
        console.log("Socket is connected, emitting message");
        socket.emit("send_message", messageData);

        // Thêm tin nhắn vào local state ngay lập tức
        const newMessageObj = {
          senderEmail: currentUser,
          receiverEmail: messageData.receiverEmail,
          content: messageData.content,
          timestamp: new Date().toISOString(),
        };
        console.log("Adding sent message to local state:", newMessageObj);
        setMessages((prev) => [...prev, newMessageObj]);
        setNewMessage("");
      } else {
        console.log("Socket is not connected, attempting to reconnect...");
        if (currentUser) {
          const newSocket = initSocket(currentUser);
          setTimeout(() => {
            if (newSocket?.connected) {
              console.log("Socket reconnected, sending message");
              newSocket.emit("send_message", messageData);

              // Thêm tin nhắn vào local state ngay lập tức
              const newMessageObj = {
                senderEmail: currentUser,
                receiverEmail: messageData.receiverEmail,
                content: messageData.content,
                timestamp: new Date().toISOString(),
              };
              console.log("Adding sent message to local state:", newMessageObj);
              setMessages((prev) => [...prev, newMessageObj]);
              setNewMessage("");
            } else {
              console.error("Failed to reconnect socket");
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const targetEmail = selectedChat?.email || changebutton;
    if (!targetEmail) return;

    const fetchMessages = async () => {
      try {
        const response = await getMessages(targetEmail);
        if (response.success) {
          setMessages(response.messages);
        } else {
          console.error("Failed to fetch messages:", response.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChat, changebutton]);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {selectedChat || changebutton ? (
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
              <Typography variant="h6">{selectedChat?.email || changebutton}</Typography>
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
            {messages.map((message, index) => {
              // const isCurrentUser = message.senderEmail === currentUser;
              const isCurrentUser =
                message.senderEmail &&
                currentUser &&
                String(message.senderEmail).toLowerCase() ===
                  String(currentUser).toLowerCase();
              return (
                <Box
                  key={index}
                  sx={{
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: isCurrentUser ? "#e8f5e9" : "#dcdcdc",
                      color: isCurrentUser ? "inherit" : "inherit",
                    }}
                  >
                   <Typography
                   sx={{
                   color: isCurrentUser ? "black" : "black", // Đổi màu rõ ràng hơn
                   wordBreak: "break-word", // Đảm bảo văn bản dài được hiển thị đúng
                   fontWeight: "normal", // Đảm bảo font weight bình thường
                   fontSize: "14px", // Đặt kích thước font cụ thể
                    }}
                   >
                   {message.content || "(Nội dung trống)"}
                 </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      {moment().format("HH:mm")}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
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
              placeholder="Hãy nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                  setNewMessage("");
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
            Hãy lựa chọn cuộc trò chuyện
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
