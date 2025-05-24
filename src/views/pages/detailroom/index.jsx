import React from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import { useParams } from "react-router-dom";
import CarouselComponent from "../../../components/carousel/carousel";
import { detailRoomInformation } from "../../../api/requestHomeApi";
import GoogleMapComponent from "../../../components/google-maps/googleMap";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import Rating from "@mui/material/Rating";
import "swiper/swiper-bundle.css";
import { Avatar, Divider, List, Skeleton, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Rate } from "antd";
import { FaHome } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { isAuthenticated } from "../../../untils/auth"; // Giả định bạn có file này
import { message } from "antd";
import { useLocation } from "react-router-dom";
import { sendMessage } from '../../../api/message'; // Giả định bạn có API gửi tin nhắn
import CardManageHorizontal from "../../../components/box/index"
import {searchRelatedRoom} from "../../../api/requestHomeApi"

const count = 4;

const DetailRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagesDetails, setImagesDetails] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [informationListRoom, setInformationListRoom] = useState({});
  const [relatedRooms, setRelatedRooms] = useState([]);

  const fetchListHomeDetail = async () => {
    try {
      const dataRoom = await detailRoomInformation(id);
      console.log("🏠 Room data:", dataRoom.dataRoom);
      if (dataRoom?.dataRoom?.room_images) {
        const images = dataRoom.dataRoom.room_images;
    
        if (Array.isArray(images) && images.length > 0) {
          // Kiểm tra nếu là dạng URL online
          if (images[0].startsWith("https://")) {
            setImagesDetails(images);
            setSelectedImage(images[0]);
          } else {
            // Dạng local (tên file)
            const fullURLs = images.map(
              (img) => `http://localhost:8000/uploads/${img}`
            );
            setImagesDetails(fullURLs);
            setSelectedImage(fullURLs[0]);
          }
        } else if (typeof images === "string") {
          // Trường hợp images là chuỗi đơn (1 ảnh duy nhất)
          const imageURL = images.startsWith("https://")
            ? images
            : `http://localhost:8000/uploads/${images}`;
          setImagesDetails([imageURL]);
          setSelectedImage(imageURL);
        }
        }
      setInformationListRoom(dataRoom.dataRoom);
    } catch (error) {
      console.error("Failed to fetch list home: ", error);
    }
  };

  useEffect(() => {
    fetchListHomeDetail();
  }, [id]);

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        Array.from({
          length: count,
        }).map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button className="reading-more" onClick={onLoadMore}>
          {" "}
          Đọc thêm
        </Button>
      </div>
    ) : null;
  // message
  const handleOpenChat = async() => {
    if (!isAuthenticated()) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      message.info("Vui lòng đăng nhập để sử dụng tính năng chat");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const sender = {
      email: informationListRoom.RentPost?.User?.email,
      userName: informationListRoom.RentPost?.User?.lastName || "Chủ nhà",
      avatar: null, 
      roomInfo: {
        id: informationListRoom.id,
        name: informationListRoom.room_name,
        image: informationListRoom.room_images?.[0] || null,
      },
    };
    const roomName = informationListRoom.room_name || "phòng này";
    const roomAddress = informationListRoom.address?.district 
      ? `ở ${informationListRoom.address.district}` 
      : "";
    
      const initialMessage = `Chào bạn, mình có thấy phòng ${roomName} ở ${roomAddress} và rất có hứng thú.` +
      `Bạn có thể cung cấp thêm thông tin chi tiết giúp mình được không?` +
      `Mong sớm nhận được phản hồi từ bạn!`
    try {
      const response = await sendMessage({
        receiverEmail: sender.email,
        content: initialMessage
      });
      
      if (response.success) {
        console.log("Tin nhắn tự động đã được gửi");
      } else {
        console.warn("Không thể gửi tin nhắn tự động:", response.message);
        // Vẫn tiếp tục mở chat ngay cả khi gửi tin nhắn thất bại
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn tự động:", error);
      // Vẫn tiếp tục mở chat ngay cả khi có lỗi
    }
    navigate("/user/chat", { state: { sender } });
  };

  const handleOpenRent = () => {
    if (!isAuthenticated()) {
      message.info("Vui lòng đăng nhập để sử dụng tính năng chat");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
  
    const sender = {
      email: informationListRoom.RentPost?.User?.email,
      userName: informationListRoom.RentPost?.User?.lastName || "Chủ nhà",
      avatar: null,
      roomInfo: {
        id: informationListRoom.id,
        name: informationListRoom.room_name,
        image: informationListRoom.room_images|| null,
        price: informationListRoom.price_per_month,
        area: informationListRoom.area,
        address: informationListRoom.address,
        description: informationListRoom.description,
      },
    };
  
  
    // Chuyển sang trang deposit và truyền dữ liệu qua state
    navigate("/user/deposit", {
      state: { sender }
    });    
  };

  useEffect(() => {
    const fetchRelatedRooms = async () => {
      if (typeof informationListRoom.address === "string" && informationListRoom.address.trim() !== "" && typeof informationListRoom.type === "string" && id) {
        console.log("Fetch related rooms with params:", {
          address: informationListRoom.address,
          type: informationListRoom.type,
          excludeId: id,
        });
  
        const result = await searchRelatedRoom(
          informationListRoom.address,
          informationListRoom.type,
          id
        );
  
        console.log("Related rooms result:", result);
        setRelatedRooms(result);
      } else {
        console.warn("Invalid parameters for fetching related rooms", {
          address: informationListRoom.address,
          type: informationListRoom.type,
          id,
        });
      }
    };
  
    fetchRelatedRooms();
  }, [informationListRoom.address, informationListRoom.type, id]);
  

  return (
    <div>
      <div className="detail-room">
        <div className="detail-room-images">
          <CarouselComponent width="100%" images={[selectedImage]} borderRadius="10px"/>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={30}
            slidesPerView={4}
            navigation
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            grabCursor={true}
            style={{ padding: "24px 0 32px" }}
          >
            {imagesDetails.length > 0 &&
              imagesDetails.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={item} // Nếu item là object, hãy đổi thành item.image_url
                    alt={`image-${index}`}
                    style={{
                      width: "200px",
                      height: "120px",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                    onClick={() => setSelectedImage(item)} // Khi click, đổi ảnh trên Carousel
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="detail-room-info">
          <h1 className="detail-room-title">{informationListRoom.room_name}</h1>
          <h4 className="detail-room-address mt-4 mb-1">
            <FontAwesomeIcon
              icon={faMapLocationDot}
              style={{ color: "#588157", marginRight: "8px" }}
            />
            {informationListRoom.address}
          </h4>
          <h3 className="detail-room-price-per-month">
            <FontAwesomeIcon
              icon={faMoneyBill}
              style={{ color: "#588157", marginRight: "8px" }}
            />
            {informationListRoom.price_per_month} vnđ/ tháng{" "}
          </h3>
          <h4 className="detail-room-status">Tình trạng: Còn phòng </h4>
          <div className="mt-5">
            <div className="flex justify-start text-base mt-1 text-[17px] space-x-10">
              <span className="text-2xl text-[#588157]">
                <FaHome />
              </span>
              <span className="text-lg font-semibold">
                {informationListRoom.RentPost?.User?.lastName ||
                  "Không có email"}
              </span>
            </div>
            <div className="flex justify-start text-base mt-3 text-[17px] space-x-10">
              <span className="text-2xl text-[#588157]">
                <FaPhone />
              </span>
              <span className="text-lg font-semibold">
                {informationListRoom.RentPost?.User?.phone_number
                  ? `0${informationListRoom.RentPost.User.phone_number}`
                  : "Không có số điện thoại"}
              </span>
            </div>
            <div className="flex justify-start text-base mt-3 text-[17px] space-x-10">
              <span className="text-2xl text-[#588157]">
                <SiGmail />
              </span>
              <span className="text-lg font-semibold">
                {informationListRoom.RentPost?.User?.email || "Không có email"}
              </span>
            </div>
            <div className="flex justify-center mt-16 space-x-8">
              <Button
                className="border rounded-[20px] p-6 font-semibold text-base"
                onClick={handleOpenChat}
              >
                Liên hệ tư vấn
              </Button>
              <Button className="border rounded-[20px] p-6 font-semibold text-base"
              onClick={handleOpenRent}
              >
                Thuê
              </Button>
            </div>
          </div>
          <div className="detail-information-list-room"></div>
        </div>
      </div>
      <div className="detail-room-description">
        <h2 className="detail-room-description-title">Thông tin mô tả</h2>
        <p className="detail-room-description-information">
          {informationListRoom.description}
        </p>
      </div>
      <div className="detail-room-interior">
        <h2 className="detail-room-description-title">Đặc điểm nổi bật</h2>
        <div className="detail-room-interior-list-display">
          <div className="detail-room-interior-list">
            <div className="detail-room-interior-list-display-item">
              <span>Mức giá</span>
              <span>
                {informationListRoom.price_per_month} triệu đồng/ tháng
              </span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Diện tích</span>
              <span>{informationListRoom.area} m2</span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Tiền điện(1 số)</span>
              <span>
      {informationListRoom?.Utility?.electricity_bill != null
    ? `${informationListRoom.Utility.electricity_bill} VND`
    : 'Không có'}
     </span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Tiền nước(1 khối)</span>
              <span>
      {informationListRoom?.Utility?.water_bill != null
    ? `${informationListRoom.Utility.water_bill} VND`
    : 'Không có'}
     </span>              
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Tiện ích</span>
              {
  informationListRoom?.Utility?.extensions
    ? Array.isArray(informationListRoom.Utility.extensions)
      ? informationListRoom.Utility.extensions.join(', ')
      : JSON.parse(informationListRoom.Utility.extensions).join(', ')
    : 'Không có'
}
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Nội thất</span>
              <span>
  {informationListRoom?.Utility?.full_furnishing
    ? "Đầy đủ"
    : "Không đầy đủ"}
</span>
            </div>
          </div>
        </div>
        <h2 className="detail-room-description-title">Xem trên bản đồ </h2>
        <div className="detail-room-map flex justify-center mt-5">
          <GoogleMapComponent address={informationListRoom.address} />
        </div>
        <hr className="border-t border-gray-100 mb-10 mt-16" />
        <div className="flex justify-start space-x-32">
          <div className="flex flex-col">
            <span className="text-[#999999]">Ngày đăng</span>
            <span>{ informationListRoom?.RentPost?.start_date}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#999999]">Ngày kết thúc</span>
            <span>{ informationListRoom?.RentPost?.expire}</span>
          </div>
          <div className="flex flex-col">
  <span className="text-[#999999]">Loại tin</span>
  <span>
  {Number(informationListRoom?.RentPost?.priority) === 1
    ? "Tin đặc biệt"
    : Number(informationListRoom?.RentPost?.priority) === 2
    ? "Tin thường"
    : Number(informationListRoom?.RentPost?.priority) === 3
    ? "Tin miễn phí"
    : "Không xác định"}
</span>
</div>
          <div className="flex flex-col">
            <span className="text-[#999999]">Mã tin</span>
            <span>{ informationListRoom?.RentPost?.id}</span>
          </div>
        </div>
        <hr className="border-t border-gray-100 my-4 mb-10 mt-10" />
       
        <h2 className="detail-room-description-title">Các phòng trọ liên quan </h2>
        <div className="mt-5 mb-10">
        <CardManageHorizontal listHome={relatedRooms} />
        </div>
      </div>
    </div>
  );
};

export default DetailRoom;
