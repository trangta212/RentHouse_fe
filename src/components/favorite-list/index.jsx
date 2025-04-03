import React, { useState, useEffect } from "react";
import { Popover, List, Card, message, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getFavoriteRooms, removeFavoriteRooms } from "../../api/favoriteApi";
import Avatar from "@mui/material/Avatar";
import { TiDeleteOutline } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";

// Component FavoriteList không chứa icon HeartFilled
const FavoriteList = ({ visible, onClose, triggerElement }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      fetchFavorites();
    }
  }, [visible]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await getFavoriteRooms(); // Gọi API để lấy danh sách yêu thích
      console.log("Favorites response:", response);
      setFavorites(response.favoriteRooms || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      message.error("Không thể tải danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/user/room-details/${roomId}`);
    onClose();
  };

  const handleRemoveFavorite = async (roomId, e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click vào Card

    try {
      // Gọi API để xóa phòng khỏi danh sách yêu thích
      const response = await removeFavoriteRooms([roomId]);
      console.log("Remove response:", response);

      // Kiểm tra phản hồi từ API
      if (
        response &&
        response.message === "Xóa các phòng khỏi danh sách yêu thích thành công"
      ) {
        // Cập nhật danh sách favorites bằng cách loại bỏ phòng vừa xóa
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.room.id !== roomId)
        );

        message.success("Đã xóa phòng khỏi danh sách yêu thích!");
      } else {
        // Hiển thị thông báo lỗi nếu có
        message.error(response?.message || "Không thể xóa phòng!");
      }
    } catch (error) {
      console.error("Error removing favorite room:", error);
      message.error("Không thể xóa phòng khỏi danh sách yêu thích!");
    }
  };

  // State để theo dõi phòng đang được hover
  const [hoveredRoomId, setHoveredRoomId] = useState(null);

  // Nội dung của Popover
  const content = (
    <div style={{ width: 350, maxHeight: 300, overflow: "auto" }}>
      <Spin spinning={loading}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Bạn chưa có phòng yêu thích nào!</p>
          </div>
        ) : (
          <List
            dataSource={favorites}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  onClick={() => handleRoomClick(item.room.id)}
                  onMouseEnter={() => setHoveredRoomId(item.room.id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      className="mr-4"
                      alt={item.room.room_name}
                      src={
                        item.room.room_images &&
                        item.room.room_images.length > 0
                          ? item.room.room_images[0]
                          : "/assets/images/default-room.jpg"
                      }
                      style={{
                        marginRight: "15px",
                        borderRadius: "10px",
                        height: "50px",
                        width: "50px",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      <h3
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          fontWeight: 600,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          margin: 0,
                        }}
                      >
                        {item.room.room_name || "Không có tên"}
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          margin: "5px 0 0 0",
                        }}
                      >
                        {item.room.description || "Không có mô tả"}
                      </p>
                    </div>
                    {hoveredRoomId === item.room.id && (
                      <TiDeleteOutline
                        className="text-2xl ml-2 text-red-500 cursor-pointer"
                        onClick={(e) => handleRemoveFavorite(item.room.id, e)}
                      />
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );

  // Tiêu đề của Popover
  const title = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>Danh sách yêu thích</span>
      <FaTimes onClick={onClose} />
    </div>
  );

  return (
    <Popover
      content={content}
      title={title}
      open={visible}
      onOpenChange={(newVisible) => {
        if (!newVisible) onClose();
      }}
      placement="bottom" // Hiển thị phía dưới
      align={{
        offset: [800, 10], // Dịch chuyển theo trục x 0px (căn giữa), theo trục y 10px
      }}
      arrow={false}
    >
      {triggerElement}
    </Popover>
  );
};

export default FavoriteList;
