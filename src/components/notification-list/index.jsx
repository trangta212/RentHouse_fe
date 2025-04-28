import React, { useState, useEffect } from "react";
import { Popover, List, Card, message, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getListNotification,getConfirmNotificationById} from "../../api/notificationApi";
import { FaTimes } from "react-icons/fa";
import { Modal } from "antd"; // thêm import
import {detailRoomInformation} from "../../api/requestHomeApi";
import { createContract } from "../../api/contractApi";

// Component FavoriteList không chứa icon HeartFilled
const NotificationList = ({ visible, onClose, triggerElement }) => {
  const [notification, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null); // lưu phòng được chọn
const [isModalOpen, setIsModalOpen] = useState(false); // trạng thái hiển thị modal
const [roomDetails, setRoomDetails] = useState(null); // lưu thông tin phòng
  const navigate = useNavigate();
  const [notificationResponseId, setNotificationResponseId] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState({}); // State lưu trạng thái thông báo


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
// Call lay thong in cua phong
useEffect(() => {
    const fetchRoomDetails = async () => {
        if (notification) {
            try {
                const response = await detailRoomInformation(selectedRoom.room_id);
                console.log("Room details response:", response);
                setRoomDetails(response.dataRoom|| null);
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        }
    };
    fetchRoomDetails();
}, [selectedRoom]);

// const handleConfirm = async (action) => {
//   if (notificationResponseId) {
//     try {
//       const response = await getConfirmNotificationById(notificationResponseId, action);
//       message.success(
//         action === 'accept' 
//           ? "Xác nhận thành công!" 
//           : "Đã từ chối và hoàn tiền thành công!"
//       );
      
//       setIsModalOpen(false);

//       // Lưu trạng thái xử lý tương ứng
//       setNotificationStatus(prevStatus => ({
//         ...prevStatus,
//         [notificationResponseId]: action === 'accept' ? 'confirmed' : 'refunded',
//       }));

//       // Đóng popover và loại bỏ thông báo khỏi giao diện
//       onClose(); 

//     } catch (error) {
//       console.error("Error processing notification:", error);
//       message.error("Không thể xử lý thông báo!");
//     }
//   } else {
//     message.error("Không tìm thấy thông báo để xử lý!");
//   }
// };
const handleConfirm = async (action) => {
  if (!selectedRoom || !selectedRoom.id) {
    message.error("Không tìm thấy thông báo để xử lý!");
    return;
  }

  setLoading(true);
  try {
    let response;
    let successMessage;

    if (selectedRoom.type === "deposit") {
      if (action !== "accept" && action !== "refund") {
        throw new Error("Hành động không hợp lệ cho đặt cọc!");
      }
      response = await getConfirmNotificationById(selectedRoom.id, action);
      successMessage =
        action === "accept"
          ? "Xác nhận thành công!"
          : "Đã từ chối và hoàn tiền thành công!";
    } else if (selectedRoom.type === "contract") {
      if (action !== "confirm" && action !== "cancel") {
        throw new Error("Hành động không hợp lệ cho hợp đồng!");
      }
      response = await createContract(selectedRoom.id, action);
      successMessage =
        action === "confirm" ? "Tạo hợp đồng thành công!" : "Đã hủy hợp đồng!";
    } else {
      throw new Error("Loại thông báo không hợp lệ!");
    }

    message.success(successMessage);
    setNotificationStatus((prevStatus) => ({
      ...prevStatus,
      [selectedRoom.id]:
        selectedRoom.type === "deposit"
          ? action === "accept"
            ? "confirmed"
            : "refunded"
          : action === "confirm"
          ? "contract_confirmed"
          : "contract_cancelled",
    }));
    setIsModalOpen(false);
    setSelectedRoom(null);
    setRoomDetails(null);
    onClose();
  } catch (error) {
    console.error(`Error processing ${selectedRoom?.type === "deposit" ? "đặt cọc" : "hợp đồng"}:`, error);
    message.error(`Không thể xử lý ${selectedRoom?.type === "deposit" ? "đặt cọc" : "hợp đồng"}!`);
  } finally {
    setLoading(false);
  }
};


const handleRoomClick = (notificationId) => {
  const selectedNoti = notification.find(n => n.id === notificationId);
  if (!selectedNoti) {
    message.error("Không tìm thấy thông báo!");
    return;
  }

  setSelectedRoom(selectedNoti);
  setNotificationResponseId(selectedNoti.id);
  setIsModalOpen(true);
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
            // dataSource={notification.filter(item => notificationStatus[item.id] !== 'confirmed')} // Ẩn thông báo đã được xác nhận
            // dataSource={notification.filter(item => notificationStatus[item.id] !== 'confirmed' && notificationStatus[item.id] !== 'refunded')}
            dataSource={notification.filter(
              (item) =>
                notificationStatus[item.id] !== "confirmed" &&
                notificationStatus[item.id] !== "refunded" &&
                notificationStatus[item.id] !== "contract_confirmed" &&
                notificationStatus[item.id] !== "contract_cancelled"
            )}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  onClick={() => handleRoomClick(item.id)}
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
    // footer={[
    //   <Button 
    //     key="refund" 
    //     onClick={() => handleConfirm('refund')}
    //     className="bg-slate-100 text-black"
    //   >
    //     Từ chối
    //   </Button>,
    //   <Button 
    //     key="accept" 
    //     onClick={() => handleConfirm('accept')}
    //     className="text-white"
    //   >
    //    Đồng ý
    //  </Button>
    // ]}
    footer={
      selectedRoom?.type === "deposit" ? [
        <Button
          key="refund"
          onClick={() => handleConfirm("refund")}
          className="bg-slate-100 text-black"
          disabled={loading}
        >
          Từ chối
        </Button>,
        <Button
          key="accept"
          onClick={() => handleConfirm("accept")}
          className="text-white"
          disabled={loading}
        >
          Đồng ý
        </Button>,
      ] : [
        <Button
          key="cancel"
          onClick={() => handleConfirm("cancel")}
          className="bg-slate-100 text-black"
          disabled={loading}
        >
          Hủy
        </Button>,
        <Button
          key="confirm"
          onClick={() => handleConfirm("confirm")}
          className="text-white"
          disabled={loading}
        >
          Xác nhận
        </Button>,
      ]
    }
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
        <p><strong>Phòng:</strong> {roomDetails?.room_name || "Không rõ"}</p>
        <p><strong>Địa chỉ:</strong> {roomDetails?.address || "Không rõ"}</p>
        <p><strong>Giá:</strong> {roomDetails?.price_per_month || "Không rõ"} triệu đồng</p>
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
