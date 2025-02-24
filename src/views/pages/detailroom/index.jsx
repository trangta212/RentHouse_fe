import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { useParams } from "react-router-dom";
import CarouselComponent from "../../../components/carousel/carousel";
import { detailRoomInformation } from "../../../api/requestHomeApi";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import Rating from '@mui/material/Rating';
import "swiper/swiper-bundle.css";
import { Avatar, Divider, List, Skeleton ,Button } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import {faMoneyBill} from "@fortawesome/free-solid-svg-icons";
import { Rate } from 'antd';
const count = 4;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;



const DetailRoom = () => {
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
  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);
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
        })),
      ),
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button className ="reading-more"
        onClick={onLoadMore}> Đọc thêm</Button>
      </div>
    ) : null;

  return (
    <div>
      <div className="detail-room">
        <div className="detail-room-images">
          <CarouselComponent 
           width="100%" 
           images={[selectedImage] } 
           />
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
                style={{ width: "200px", height: "120px", cursor: "pointer", borderRadius: "8px" }}
                onClick={() => setSelectedImage(item)} // Khi click, đổi ảnh trên Carousel
              />
            </SwiperSlide>
          ))}
      </Swiper>
        </div>
        <div className="detail-room-info">
          <h1 className = "detail-room-title">{informationListRoom.room_name}</h1>
          <h4 className = "detail-room-address">  
          <FontAwesomeIcon icon={faMapLocationDot} 
          style={{ color: "#588157", marginRight: "8px" }}
          />
          {informationListRoom.address} 
          </h4>
          <h3 className = "detail-room-price-per-month">
          <FontAwesomeIcon icon={faMoneyBill} 
          style={{ color: "#588157", marginRight: "8px" }}
          />
            {informationListRoom.price_per_month} triệu đồng/ tháng </h3>
          <h4 className = "detail-room-status">
            Tình trạng: Còn phòng  </h4>
          <Rating 
           name="half-rating-read"  
           value={parseFloat(informationListRoom.rating) || 0}  
           precision={0.5} 
           readOnly 
           />
          <div className ="detail-information-list-room">
          </div>
        </div>
      </div>
      <div className="detail-room-description">
        <h2 className="detail-room-description-title">Thông tin mô tả</h2>
        <p className ="detail-room-description-information">{informationListRoom.description}</p>
      </div>
      <div className="detail-room-interior">
      <h2 className="detail-room-description-title">Đặc điểm nổi bật</h2>
      <div className="detail-room-interior-list-display">
        <div className="detail-room-interior-list">
        <div className="detail-room-interior-list-display-item">
          <span>Mức giá</span>
          <span>{informationListRoom.price_per_month} triệu đồng/ tháng</span>
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
      <h2 className="detail-room-description-title">Bình luận từ người dùng đã thuê </h2>
    <div className="detail-room-comment-display">
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={item.picture.large} />}
              title={<a href="https://ant.design">{item.name?.last}</a>}
              description={
                <div style={{ backgroundColor: "#E8F5E9", padding: "12px", borderRadius: "8px" , height: "130px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rate disabled defaultValue={item.rating} style={{ fontSize: "16px" }} /> 
                    <span style={{ marginLeft: "8px"}}>{item.rating}/5</span>
                  </div>
                  <p style={{ marginTop: "10px", fontSize: "15px" ,fontFamily: "Roboto", color: "black" , display: "flex", alignItems: "center"}}>
                    {/* {item.comment} */}
                    Phòng trọ rất sạch sẽ, thoáng mát, giá cả hợp lý, chủ nhà thân thiện

                  </p>
                </div>
              }
            />
          </Skeleton>
        </List.Item>
      )}
    />
    </div>  
    <h2 className="detail-room-description-title">Các dự án liên quan </h2>
    </div>
    </div>
  );
};

export default DetailRoom;
