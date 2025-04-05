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

const ChatBox = ({ currentUser, selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

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
      receiverEmail: selectedChat?.email,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message with data:", messageData);

    try {
      if (isSocketConnected) {
        console.log("Socket is connected, emitting message");
        socket.emit("sendMessage", messageData);
      } else {
        console.log("Socket is not connected, attempting to reconnect...");
        if (currentUser?.email) {
          const newSocket = initSocket(currentUser.email);
          setTimeout(() => {
            if (newSocket?.connected) {
              console.log("Socket reconnected, sending message");
              newSocket.emit("sendMessage", messageData);
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

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {selectedChat ? (
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
            <Avatar
              src={selectedChat.avatar}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">{selectedChat.userName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isSocketConnected ? "Đang kết nối" : "Đang kết nối lại..."}
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
                        : "white",
                    color:
                      message.senderEmail === currentUser?.email
                        ? "white"
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
