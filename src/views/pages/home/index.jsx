import React from "react";
import ReactDOM from "react-dom";
import MediaCard from "../../../components/card/card.jsx";
import CarouselComponent from "../../../components/carousel/carousel.jsx";
import CardPaper from "../../../components/card_peper/cardpeper.jsx";
import img1 from "../../../assets/images/cours-up-2.jpg";
import img2 from "../../../assets/images/cours-up-1.jpg";
import img3 from "../../../assets/images/cours3.jpg";
import img4 from "../../../assets/images/cours4.jpg";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Input } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space, Tooltip } from "antd";
import "./index.css";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Message, Money,Monitor } from 'iconsax-react';





const { Search } = Input;

const HomePage = () => {
  const images = [img1, img2, img3, img4];
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName); // Cập nhật nút đang được chọn
  };
  // Chức năng lọc và tìm kiếm
  const [location, setLocation] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [area, setArea] = useState("all");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState([]);

  const navigateToSearch = (searchKeyword) => {
    const path = `/user/home/${location || "all"}/${propertyType || "all"}/${
      priceRange || "all"
    }/${area || "all"}?q=${encodeURIComponent(searchKeyword || "")}`;
    navigate(path);
  };
  // Địa điểm
  const locationItems = [
    { label: "Hà Nội", key: "hà-nội" },
    { label: "TP.HCM", key: "hồ-chí-minh" },
  ];

  const handleLocationChange = ({ key }) => {
    setLocation(key);
  };

  const locationMenuProps = {
    items: locationItems,
    onClick: handleLocationChange,
  };
  // Loại nhà
  const propertyTypeItems = [
    { label: "Phòng trọ", key: "phongtro" },
    { label: "Nhà nguyên căn", key: "nhanguyencan" },
    { label: "Căn hộ chung cư", key: "canho" },
    { label: "Chung cư mini", key: "chungcumini" },
  ];
  const handlePropertyTypeChange = ({ key }) => {
    setPropertyType(key);
  };
  const propertyTypeMenuProps = {
    items: propertyTypeItems,
    onClick: handlePropertyTypeChange,
  };
  // Mức giá
  const priceRangeItems = [
    { label: "Dưới 1 triệu", key: "1" },
    { label: "1-3 triệu", key: "1-3" },
    { label: "3-5 triệu", key: "3-5" },
    { label: "Trên 5 triệu", key: "5-7" },
    { label: "Trên 10 triệu", key: "7-10" },
    { label: "Trên 20 triệu", key: "20-50" },
    { label: "Trên 50 triệu", key: "50-100" },
    { label: "Trên 100 triệu", key: "100-1000" },
  ];
  const handlePriceRangeChange = ({ key }) => {
    setPriceRange(key);
  };
  const priceRangeMenuProps = {
    items: priceRangeItems,
    onClick: handlePriceRangeChange,
  };
  // Diện tích
  const areaItems = [
    { label: "Dưới 20m2", key: "10-20" },
    { label: "20-50m2", key: "20-30" },
    { label: "50-100m2", key: "30-80" },
    { label: "Trên 100m2", key: "80-200" },
  ];
  const handleAreaChange = ({ key }) => {
    setArea(key);
  };
  const areaMenuProps = {
    items: areaItems,
    onClick: handleAreaChange,
  };
  // Thanh tìm kiếm

  const onSearch = (value) => {
    setKeyword(value);
    navigateToSearch(value);
  };
// Gọi api danh sách phòng
  return (
    <div>
      <div className="home">
        <div className="carousel-container p-5" >
        <div className="w-full h-[85vh] rounded-[15px] bg-gradient-to-r from-[#C1DEE8] to-[#F3DCC4] flex">
  {/* Bên trái chiếm 1/2 (nội dung bạn đang xử lý bằng CSS riêng) */}
  <div className="w-1/2 relative">
    {/* Vẫn giữ nguyên các absolute như search-container, dropdowns... */}
    {/* Chỉ cần đảm bảo div này là relative để các absolute tính toán đúng */}
    <h1 className ="flex items-center justify-center mt-36 font-semibold text-[40px]">Tìm kiếm ngôi nhà mong muốn</h1>
    <p className ="flex items-center justify-center">  Hãy nhanh chóng tìm kiếm ngôi nhà của bạn với chúng tôi</p>
    <div className="search-container">
      <Dropdown menu={locationMenuProps} className="dropdown-custom">
        <Button size="large" className="button-custom mt-[1px]">
          <Space>
            Địa điểm
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Search
        className="search-custom flex-grow"
        placeholder="Nhập từ khóa tìm kiếm"
        allowClear
        onSearch={onSearch}
        style={{
          height: 200,
        }}
      />
    </div>

    <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-4">
      <Dropdown menu={propertyTypeMenuProps}>
        <Button
          size="large"
          className="bg-white text-[#bab9b9] px-4 py-2 rounded-md shadow"
        >
          <Space>
            Loại nhà <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      <Dropdown menu={priceRangeMenuProps}>
        <Button
          size="large"
          className="bg-white text-[#bab9b9] px-4 py-2 rounded-md shadow"
        >
          <Space>
            Mức giá <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      <Dropdown menu={areaMenuProps}>
        <Button
          size="large"
          className="bg-white text-[#bab9b9] px-4 py-2 rounded-md shadow"
        >
          <Space>
            Diện tích <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  </div>

  {/* Bên phải - ảnh */}
  <div className="w-1/2 h-full flex justify-center items-center">
    <img
      src={require("../../../assets/images/Group 2.png")}
      alt="Centered"
      className="h-full w-auto object-contain"
    />
  </div>
</div>
        </div>
        <div className="mt-5 mb-5">
          <h1 className="flex items-center justify-center text-2xl font-semibold">Thuê trọ trở nên dễ dàng hơn</h1>
          <div className="flex mt-6"> 
          <div className="flex flex-col items-center w-1/3">
      <Message size="36" color="#58BF52" variant="Bold" />
      <h1 className="mt-2 text-base font-semibold"> Nhắn tin</h1>
      <p className="mt-1 text-sm text-gray-600 text-center">Nhanh chóng liên hệ với chủ trọ</p>
    </div>
    <div className="flex flex-col items-center w-1/3">
      <Money size="36" color="gold" variant="Bold" />
      <h1 className="mt-2 text-base font-semibold">Đặt cọc</h1>  {/* Thay đổi title */}
      <p className="mt-1 text-sm text-gray-600 text-center">Nhanh chóng có phòng yêu thích</p>
    </div>
    <div className="flex flex-col items-center w-1/3">
      <Monitor size="36" color="#1E40AF" variant="Bold" />  {/* Icon AI và màu xanh lớp biển */}
      <h1 className="mt-2 text-base font-semibold">ChatBot</h1>  {/* Thay đổi title */}
      <p className="mt-1 text-sm text-gray-600 text-center">Hỗ trợ bạn kịp thời</p>
    </div>
          </div>
        </div>
        <div>
          <div className="NavFilterHomePage">
            <Flex wrap gap={30} className="NavFilterHomePage">
              <Button
                onClick={() => handleButtonClick("phongtro")}
                style={{
                  backgroundColor:
                    selectedButton === "phongtro" ? "#4caf4f" : "",
                }}
              >
                Phòng trọ
              </Button>

              <Button
                onClick={() => handleButtonClick("nhanguyencan")}
                style={{
                  backgroundColor:
                    selectedButton === "nhanguyencan" ? "#4caf4f" : "",
                }}
              >
                Nhà nguyên căn
              </Button>

              <Button
                onClick={() => handleButtonClick("canho")}
                style={{
                  backgroundColor: selectedButton === "canho" ? "#4caf4f" : "",
                }}
              >
                Căn hộ chung cư
              </Button>

              <Button
                onClick={() => handleButtonClick("chungcumini")}
                style={{
                  backgroundColor:
                    selectedButton === "chungcumini" ? "#4caf4f" : "",
                }}
              >
                Chung cư mini
              </Button>
            </Flex>
          </div>
          <h1 className="titleListHomePage">Các phòng trọ phổ biến</h1>
          <div className="flex items-center justify-center">
            <MediaCard />
          </div>
          <h1 className="titleListHomePage">Các tin tức liên quan</h1>
          <div className="paper-homepage-container">
            <div className="paper-homepage-container-center">
              <CardPaper />
            </div>
            <div className="paper-homepage-container-list">
              <List
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h7">
                        {" "}
                        {/* Điều chỉnh cỡ chữ ở đây */}
                        Giá trị chung cư sau Tết Nguyên Đán
                      </Typography>
                    }
                    secondary={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          3 ngày trước
                        </Typography>
                      </div>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
