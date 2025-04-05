// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   TextField,
//   InputAdornment,
//   Divider,
//   Badge,
//   IconButton,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   MoreVert as MoreVertIcon,
// } from "@mui/icons-material";
// import moment from "moment";
// import "moment/locale/vi";
// import { getConversations } from "../api/message"; // Import API từ thư mục api

// // Component SideBar hiển thị danh sách cuộc trò chuyện
// const SideBar = ({ currentUser, selectedChat, onSelectChat }) => {
//   const [chatList, setChatList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch danh sách cuộc trò chuyện
//   useEffect(() => {
//     const fetchChatList = async () => {
//       if (!currentUser?.id) return;

//       setLoading(true);
//       try {
//         // Sử dụng API từ chatApi thay vì gọi axios trực tiếp
//         const response = await getConversations();

//         if (response.success) {
//           setChatList(response.conversations);
//         }
//       } catch (error) {
//         console.error("Error fetching chat list:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChatList();
//   }, [currentUser]);

//   // Lọc danh sách theo từ khóa tìm kiếm
//   const filteredChatList = chatList.filter((chat) =>
//     chat.userName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Format thời gian tin nhắn gần nhất
//   const formatLastMessageTime = (timestamp) => {
//     return moment(timestamp).locale("vi").fromNow();
//   };

//   return (
//     <Box
//       sx={{
//         width: 320,
//         borderRight: "1px solid #e0e0e0",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Header của sidebar */}
//       <Box
//         sx={{
//           padding: 2,
//           backgroundColor: "#f5f5f5",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h6" fontWeight={600}>
//           Tin nhắn
//         </Typography>
//         <IconButton>
//           <MoreVertIcon />
//         </IconButton>
//       </Box>

//       {/* Search box */}
//       <Box sx={{ padding: 2 }}>
//         <TextField
//           fullWidth
//           placeholder="Tìm kiếm cuộc trò chuyện"
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>

//       <Divider />

//       {/* Danh sách cuộc trò chuyện */}
//       <Box sx={{ flexGrow: 1, overflow: "auto" }}>
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
//             <Typography>Đang tải...</Typography>
//           </Box>
//         ) : filteredChatList.length === 0 ? (
//           <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
//             <Typography color="text.secondary">
//               {searchTerm
//                 ? "Không tìm thấy kết quả"
//                 : "Chưa có cuộc trò chuyện nào"}
//             </Typography>
//           </Box>
//         ) : (
//           <List sx={{ padding: 0 }}>
//             {filteredChatList.map((chat) => (
//               <ListItem
//                 key={chat.id}
//                 button
//                 selected={selectedChat?.id === chat.id}
//                 onClick={() => onSelectChat(chat)}
//                 sx={{
//                   padding: 2,
//                   backgroundColor:
//                     selectedChat?.id === chat.id ? "#f0f7ff" : "transparent",
//                   "&:hover": {
//                     backgroundColor: "#f5f5f5",
//                   },
//                 }}
//               >
//                 <ListItemAvatar>
//                   <Badge
//                     color="error"
//                     variant="dot"
//                     invisible={!chat.unreadCount}
//                     overlap="circular"
//                     anchorOrigin={{
//                       vertical: "bottom",
//                       horizontal: "right",
//                     }}
//                   >
//                     <Avatar
//                       src={
//                         chat.avatar ||
//                         `https://ui-avatars.com/api/?name=${chat.userName}&background=random`
//                       }
//                       alt={chat.userName}
//                     />
//                   </Badge>
//                 </ListItemAvatar>
//                 <ListItemText
//                   primary={
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight={chat.unreadCount ? 700 : 400}
//                     >
//                       {chat.userName || "Người dùng"}
//                     </Typography>
//                   }
//                   secondary={
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       noWrap
//                       fontWeight={chat.unreadCount ? 600 : 400}
//                     >
//                       {chat.lastMessage || "Chưa có tin nhắn"}
//                     </Typography>
//                   }
//                 />
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{ minWidth: 60, textAlign: "right" }}
//                 >
//                   {chat.lastMessageTime
//                     ? formatLastMessageTime(chat.lastMessageTime)
//                     : ""}
//                 </Typography>
//               </ListItem>
//             ))}
//           </List>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default SideBar;
import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import { getConversations } from "../api/message"; // Đảm bảo đường dẫn đúng

const Sidebar = ({ onSelectChat }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations();
        if (response.success) {
          // Lấy content đầu tiên mới nhất của mỗi người
          const formattedData = response.conversations.map((conversation) => ({
            title: conversation.senderEmail,
            description: conversation.messages[0]?.content || "Không có tin nhắn",
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div style={{  padding:"10px",width: "300px", borderRight: "1px solid #ccc" }}>
      <div className ="bg-[#FEB2BE] p-4 mb-4 rounded-lg ">
      <h2 className="text-base font-semibold">Danh sách hội thoại</h2>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item onClick={() => onSelectChat(item.title)} style={{ cursor: "pointer" }}>
          {/* //  <List.Item onClick={handleOpenChat} style={{ cursor: "pointer" }}> */}
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;