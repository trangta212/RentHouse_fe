import React, { useState, useEffect } from "react";
import { Popover, List, Card, message, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getListNotification } from "../../api/notificationApi";
import { FaTimes } from "react-icons/fa";
import { Modal } from "antd"; // thêm import

// Component FavoriteList không chứa icon HeartFilled
const NotificationList = ({ visible, onClose, triggerElement }) => {
  const [notification, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null); // lưu phòng được chọn
const [isModalOpen, setIsModalOpen] = useState(false); // trạng thái hiển thị modal
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      fetchNotification();
    }
  }, [visible]);

  const fetchNotification = async () => {
    setLoading(true);
    try {
      const response = await getListNotification(); // Gọi API để lấy danh sách yêu thích
      console.log("Favorites response:", response);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      message.error("Không thể tải danh sách các thông báo!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId) => {
    const room = notification.find(n => n.room_id === roomId);
    setSelectedRoom(room);
    setIsModalOpen(true);  // mở modal
    onClose();
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // State để theo dõi phòng đang được hover
  const [hoveredRoomId, setHoveredRoomId] = useState(null);

  // Nội dung của Popover
  const content = (
    <div style={{ width: 300, maxHeight: 300, overflow: "auto" }}>
      <Spin spinning={loading}>
        {notification.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Bạn chưa có thông báo nào!</p>
          </div>
        ) : (
          <List
            dataSource={notification}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  onClick={() => handleRoomClick(item.room_id)}
                  onMouseEnter={() => setHoveredRoomId(item.room_id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      {/* <h3
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
                      </h3> */}
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
                        {item.message || "Không có mô tả"}
                      </p>
                    </div>
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
      <span>Danh sách các thông báo</span>
      <FaTimes onClick={onClose} />
    </div>
  );

  return (
    <>
    <Popover
      content={content}
      title={title}
      open={visible}
      onOpenChange={(newVisible) => {
        if (!newVisible) onClose();
      }}
      placement="bottom" // Hiển thị phía dưới
      align={{
        offset: [1250, 10], // Dịch chuyển theo trục x 0px (căn giữa), theo trục y 10px
      }}
      arrow={false}
    >
      {triggerElement}
    </Popover>
    <Modal
    title="🔔 Thông báo đặt cọc mới "
    open={isModalOpen}
    onCancel={handleModalClose}
    footer={[
      <Button key="close" onClick={handleModalClose}
      className="bg-slate-100 text-black"
      >
        Từ chối
      </Button>,
      <Button key="close" onClick={handleModalClose}
      className="text-white"
      >
       Đồng ý
     </Button>
    ]}
  >
    <div className="flex justify-center items-center text-xs"> 
    <img
      src={require("../../assets/images/Icon.png")}
      alt="images"
      className="imagesland w-20 h-20  " // Điều chỉnh kích thước ảnh (ví dụ: 64x64px)
    />
</div>
    {selectedRoom ? (
      <div>
        <p><strong>Phòng:</strong> {selectedRoom.room?.room_name || "Không rõ"}</p>
        <p><strong>Địa chỉ:</strong> {selectedRoom.message}</p>
        <p><strong>Giá:</strong> {selectedRoom.message}</p>
        <p><strong>Thông báo:</strong> {selectedRoom.message}</p>
        <p class="mb-2">
       📌 Lưu ý quan trọng: Bạn có 3 ngày kể từ thời điểm nhận thông báo này để xác nhận yêu cầu đặt cọc.
        </p>
         <p>
         Nếu quá thời hạn 3 ngày mà bạn không xác nhận, hệ thống sẽ huỷ trạng thái đặt phòng để đảm bảo công bằng cho những người dùng khác.
        </p>

        {/* Nếu muốn thêm thông tin chi tiết nữa thì render ở đây */}
      </div>
    ) : (
      <Spin />
    )}
  </Modal>
  </>
  );
};

export default NotificationList; ;
