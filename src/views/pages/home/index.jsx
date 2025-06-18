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
import { Message, Money, Monitor } from 'iconsax-react';
import { searchNearByRoom } from "../../../api/requestHomeApi.jsx";
import { useForm, Controller } from 'react-hook-form';
import CardSearch from "../../../components/card-search/index.jsx";
import ChatBotPopup from "../chatbot/index.jsx";








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

  // const navigateToSearch = (searchKeyword) => {
  //   const path = `/user/home/${location || "all"}/${propertyType || "all"}/${
  //     priceRange || "all"
  //   }/${area || "all"}?q=${encodeURIComponent(searchKeyword || "")}`;
  //   navigate(path);
  // };
  const navigateToSearch = (searchKeyword, customLocation) => {
    const path = `/user/home/${customLocation || location || "all"}/${propertyType || "all"
      }/${priceRange || "all"}/${area || "all"}?q=${encodeURIComponent(
        searchKeyword || ""
      )}`;
    navigate(path);
  };
  // Địa điểm
  const locationItems = [
    { label: "Hà Nội", key: "ha-noi" },
    { label: "TP.HCM", key: "ho-chi-minh" },
    { label:"Đà Nẵng", key:"da-nang"},
    {label:"Huế", key:"hue"}
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
  const { register, handleSubmit, watch, control } = useForm();
  const [roomSearch, setRoomSearch] = useState([]);
  const [locationSearch, setLocationSearch] = useState({ latitude: null, longitude: null, radius: null });
  useEffect(() => {
    console.log(watch()); // theo dõi các input đang được quản lý
  }, [watch]);
  const onSubmit = async (data) => {
    const { address, distance } = data;
    console.log("Địa chỉ:", address, distance);
  
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}&limit=1&country=VN`
      );
  
      const result = await response.json();
  
      if (result.features && result.features.length > 0) {
        const [lon, lat] = result.features[0].center;
        setLocationSearch({
          latitude: lat,
          longitude: lon,
          radius: parseFloat(distance),
        });
      } else {
        alert("Không tìm thấy tọa độ từ địa chỉ");
      }
    } catch (error) {
      console.error("Geocoding error (Mapbox):", error);
    }
  };
  

  useEffect(() => {
    const { latitude, longitude, radius } = locationSearch;
    if (latitude && longitude && radius) {
      searchNearByRoom(latitude, longitude, radius).then((rooms) => {
        console.log('Rooms found:', rooms);
        setRoomSearch(rooms);
        // có thể lưu vào state, hoặc đẩy sang component cha
      });
    }
  }, [locationSearch]);

  return (
    <div>
      <div className="home">
        <div className="carousel-container p-5" >
          <div className="w-full h-[85vh] rounded-[15px] bg-gradient-to-r from-[#C1DEE8] to-[#F3DCC4] flex">
            {/* Bên trái chiếm 1/2 (nội dung bạn đang xử lý bằng CSS riêng) */}
            <div className="w-1/2 relative">
              {/* Vẫn giữ nguyên các absolute như search-container, dropdowns... */}
              {/* Chỉ cần đảm bảo div này là relative để các absolute tính toán đúng */}
              <h1 className="flex items-center justify-center mt-36 font-semibold text-[40px]">Tìm kiếm ngôi nhà mong muốn</h1>
              <p className="flex items-center justify-center">  Hãy nhanh chóng tìm kiếm ngôi nhà của bạn với chúng tôi</p>
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
          {/* <div className="NavFilterHomePage">
            <Flex wrap gap={30} className="NavFilterHomePage">
              <Button
                onClick={() => handleButtonClick("nhatro")}
                style={{
                  backgroundColor:
                    selectedButton === "nhatro" ? "#4caf4f" : "",
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
                onClick={() => handleButtonClick("chungcu")}
                style={{
                  backgroundColor: selectedButton === "chungcu" ? "#4caf4f" : "",
                }}
              >
                Chung cư
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
              <Button
                onClick={() => handleButtonClick("canhodichvu")}
                style={{
                  backgroundColor:
                    selectedButton === "canhodichvu" ? "#4caf4f" : "",
                }}
              >
                Căn hộ dịch vụ
              </Button>
            </Flex>
          </div> */}

          <div className="ml-[70px] mr-[70px] flex h-80 items-center mt-16 mb-16 bg-[#fbf4ff] rounded-[20px]">
            <div className="flex items-center justify-center w-1/2 h-full">
              <img src={require("../../../assets/images/location.png")} alt="Centered" className="h-84 w-auto object-contain" />
            </div>
            <div className="flex flex-col items-center justify-center w-1/2 h-full">
              <h2 className="text-3xl font-poppins font-bold text-[#5E6282]">
                Vị trí hiện tại của bạn
              </h2>
              <p className="text-sm text-slate-500 font-sans mt-2 mb-5">
                Nhập địa chỉ để có thể tìm các phòng gần bạn nhất
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-center w-full">
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      size="large"
                      className="w-2/3 font-medium rounded-3xl px-4 py-3"
                      placeholder="Hãy điền địa chỉ của bạn hiện tại"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="distance"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      size="large"
                      type="number"
                      className="w-1/5 font-medium rounded-3xl px-4 py-3"
                      placeholder="Km"
                      {...field}
                    />
                  )}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="rounded-3xl h-[48px] px-4 flex items-center justify-center"
                >
                  <SearchOutlined />
                </Button>
              </form>
            </div>
          </div>
          <div className="NavFilterHomePage">
            <Flex wrap gap={30} className="NavFilterHomePage">
              <Button
                onClick={() => handleButtonClick("nhatro")}
                style={{
                  backgroundColor:
                    selectedButton === "nhatro" ? "#4caf4f" : "",
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
                onClick={() => handleButtonClick("chungcu")}
                style={{
                  backgroundColor: selectedButton === "chungcu" ? "#4caf4f" : "",
                }}
              >
                Chung cư
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
              <Button
                onClick={() => handleButtonClick("canhodichvu")}
                style={{
                  backgroundColor:
                    selectedButton === "canhodichvu" ? "#4caf4f" : "",
                }}
              >
                Căn hộ dịch vụ
              </Button>
            </Flex>
          </div>
          <div>
            {roomSearch.length > 0 && (
              <>
                <h1 className="titleListHomePage">Các phòng trọ gần bạn nhất</h1>
                <div className="flex items-center justify-center">
                  <CardSearch listHome={roomSearch} />
                </div>
              </>
            )}
          </div>
          <h1 className="titleListHomePage">Các phòng trọ phổ biến</h1>
          <div className="flex items-center justify-center">
            <MediaCard selectedButton={selectedButton} />
          </div>
          <h1 className="titleListHomePage">Thuê nhà trọ theo địa điểm</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 ml-[160px] mr-[160px] mb-20">

            <div className="relative h-56 md:col-span-2 rounded-xl overflow-hidden"
              onClick={() => {
                handleLocationChange({ key: "ha-noi" }); // Lưu địa điểm vào state
                navigateToSearch("", "ha-noi"); // Gọi tìm kiếm với "hà-nội" làm location
              }}
            >
              <img
                src={require("../../../assets/images/anh-ha-noi.jpg")}
                alt="Hà Nội"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
                <h2 className="text-xl font-bold">Hà Nội</h2>
              </div>
            </div>

            <div className="relative h-56 rounded-xl overflow-hidden"
              onClick={() => {
                handleLocationChange({ key: "ho-chi-minh" }); // Lưu địa điểm vào state
                navigateToSearch("", "ho-chi-minh"); // Gọi tìm kiếm với "hà-nội" làm location
              }}
            >
              <img
                src={require("../../../assets/images/hcm.jpg")}
                alt="Hà Nội"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
                <h2 className="text-lg font-bold">TP.Hồ Chí Minh</h2>
              </div>
            </div>

            {/* Đà Nẵng */}
            <div className="relative h-56 rounded-xl overflow-hidden"
              onClick={() => {
                handleLocationChange({ key: "da-nang" }); // Lưu địa điểm vào state
                navigateToSearch("", "da-nang"); // Gọi tìm kiếm với "hà-nội" làm location
              }}
            >
              <img
                src={require("../../../assets/images/danang.jpg")}
                alt="Đà Nẵng"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
                <h2 className="text-lg font-bold">Đà Nẵng</h2>
              </div>
            </div>

            {/* Bình Dương */}
            <div className="relative h-56 rounded-xl overflow-hidden"
              onClick={() => {
                handleLocationChange({ key: "hai-phong" }); // Lưu địa điểm vào state
                navigateToSearch("", "hai-phong"); // Gọi tìm kiếm với "hà-nội" làm location
              }}
            >
              <img
                src={require("../../../assets/images/hp.jpg")}
                alt="Hải Phòng"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
                <h2 className="text-lg font-bold">Hải Phòng</h2>
              </div>
            </div>

            {/* Đồng Nai */}
            <div className="relative h-56 rounded-xl overflow-hidden"
              onClick={() => {
                handleLocationChange({ key: "hue" }); // Lưu địa điểm vào state
                navigateToSearch("", "hue"); // Gọi tìm kiếm với "hà-nội" làm location
              }}
            >
              <img
                src={require("../../../assets/images/hue.jpg")}
                alt="Huế"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
                <h2 className="text-lg font-bold">Huế</h2>
              </div>
            </div>
          </div>
        </div>
        <ChatBotPopup />
      </div>
    </div>
  );
};
export default HomePage;
