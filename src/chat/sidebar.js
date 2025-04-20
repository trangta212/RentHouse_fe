import React, { useEffect, useState } from "react";
import { List, Avatar, Typography } from "antd";
import { getConversations } from "../api/message";

const Sidebar = ({ onSelectChat }) => {
  const [data, setData] = useState([]);

  // Hàm format tên từ email
  const formatNameFromEmail = (email) => {
    if (!email) return "Người dùng";
    
    // Lấy phần trước dấu @
    const namePart = email.split('@')[0];
    
    // Tách các từ dựa trên cách viết camelCase hoặc có số
    const words = namePart.replace(/([a-z])([A-Z])/g, '$1 $2')  // Tách camelCase
                       .replace(/([a-zA-Z])(\d)/g, '$1 $2')     // Tách chữ và số
                       .split(/[\s_]+/);                        // Tách theo dấu cách hoặc gạch dưới
    
    // Viết hoa chữ cái đầu của mỗi từ
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Hàm cắt ngắn mô tả nếu quá dài
  const truncateDescription = (text, maxLength = 30) => {
    if (!text) return "Không có tin nhắn";
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations();
        if (response.success) {
          const formattedData = response.conversations.map((conversation) => ({
            title: conversation.senderEmail,
            formattedTitle: formatNameFromEmail(conversation.senderEmail),
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
    <div style={{ padding: "10px", width: "300px", borderRight: "1px solid #ccc" }}>
      <div className="bg-[#FEB2BE] p-4 mb-4 rounded-lg">
        <h2 className="text-base font-semibold">Danh sách hội thoại</h2>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item onClick={() => onSelectChat(item.title)} style={{ cursor: "pointer" }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={
                <Typography.Text ellipsis style={{ maxWidth: '100%' }}>
                  {item.formattedTitle}
                </Typography.Text>
              }
              description={
                <Typography.Text ellipsis style={{ maxWidth: '100%' }}>
                  {truncateDescription(item.description)}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;