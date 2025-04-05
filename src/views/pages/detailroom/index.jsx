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

const count = 4;

const DetailRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagesDetails, setImagesDetails] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [informationListRoom, setInformationListRoom] = useState({});

  const fetchListHomeDetail = async () => {
    try {
      const dataRoom = await detailRoomInformation(id);
      if (dataRoom.dataRoom.room_images) {
        const images = dataRoom.dataRoom.room_images;
        setImagesDetails(images);
        setSelectedImage(dataRoom.dataRoom.room_images[0]); // Chọn ảnh đầu tiên làm mặc định
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
  const handleOpenChat = () => {
    if (!isAuthenticated()) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      message.info("Vui lòng đăng nhập để sử dụng tính năng chat");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const receiver = {
      email: informationListRoom.RentPost?.User?.email,
      userName: informationListRoom.RentPost?.User?.lastName || "Chủ nhà",
      avatar: null, // Cần cập nhật nếu API có trả về avatar
      roomInfo: {
        id: informationListRoom.id,
        name: informationListRoom.room_name,
        image: informationListRoom.room_images?.[0] || null,
      },
    };

    navigate("/user/chat", { state: { receiver } });
  };

  return (
    <div>
      <div className="detail-room">
        <div className="detail-room-images">
          <CarouselComponent width="100%" images={[selectedImage]} />
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
          <h4 className="detail-room-address">
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
            {informationListRoom.price_per_month} triệu đồng/ tháng{" "}
          </h3>
          <h4 className="detail-room-status">Tình trạng: Còn phòng </h4>
          <Rating
            name="half-rating-read"
            value={parseFloat(informationListRoom.rating) || 0}
            precision={0.5}
            readOnly
          />
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
              <Button className="border rounded-[20px] p-6 font-semibold text-base">
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
              <span>Số phòng ngủ</span>
              <span>1</span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Số phòng vệ sinh</span>
              <span>1</span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Tiện ích</span>
              <span>Camera, bảo vệ, phòng cháy chữa cháy</span>
            </div>
            <div className="detail-room-interior-list-display-item">
              <span>Nội thất</span>
              <span>tủ lạnh, máy giặt ....</span>
            </div>
          </div>
        </div>
        <h2 className="detail-room-description-title">Xem trên bản đồ </h2>
        <div className="detail-room-map">
          <GoogleMapComponent address={informationListRoom.address} />
        </div>
        <hr className="border-t border-gray-100 mb-10 mt-16" />
        <div className="flex justify-start space-x-32">
          <div className="flex flex-col">
            <span className="text-[#999999]">Ngày đăng</span>
            <span>21/02/2003</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#999999]">Ngày kết thúc</span>
            <span>21/03/2003</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#999999]">Loại tin</span>
            <span>Tin thường </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#999999]">Mã tin</span>
            <span>1245</span>
          </div>
        </div>
        <hr className="border-t border-gray-100 my-4 mb-10 mt-10" />
        <h2 className="detail-room-description-title">
          Bình luận từ người dùng đã thuê{" "}
        </h2>
        <div className="detail-room-comment-display">
          {list.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "gray",
              }}
            >
              Không có bình luận nào
            </div>
          ) : (
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={<Avatar src={item.picture?.large} />}
                      title={<a href="https://ant.design">{item.name?.last}</a>}
                      description={
                        <div
                          style={{
                            backgroundColor: "#E8F5E9",
                            padding: "12px",
                            borderRadius: "8px",
                            height: "130px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Rate
                              disabled
                              defaultValue={item.rating}
                              style={{ fontSize: "16px" }}
                            />
                            <span style={{ marginLeft: "8px" }}>
                              {item.rating}/5
                            </span>
                          </div>
                          <p
                            style={{
                              marginTop: "10px",
                              fontSize: "15px",
                              fontFamily: "Roboto",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.comment || "Không có bình luận nào"}
                          </p>
                        </div>
                      }
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          )}
        </div>
        <h2 className="detail-room-description-title">Các dự án liên quan </h2>
      </div>
    </div>
  );
};

export default DetailRoom;
