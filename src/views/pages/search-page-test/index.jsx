import React from "react";
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { Segmented } from 'antd'
import { Avatar, List } from 'antd';
import "./index.css";
import MapboxComponent2 from "../../../components/map-points/google-map-2";
import { fetchFilteredRooms } from '../../../api/filterApi';
import { Rate } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const { Search } = Input;


const SearchPageTest = () => {
    //Phần gọi api
    const { location, propertyType, priceRange, area } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const keyword = query.get('q');
  
    const [rooms, setRooms] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchFilteredRooms({
          location,
          propertyType,
          priceRange,
          area,
          keyword,
        });
        const updatedRooms = data.data.map((room) => {
          const roomImage =
            room.room_images && room.room_images.length > 0
              ? room.room_images[0].startsWith("https://")
                ? room.room_images[0]
                : `http://localhost:8000/uploads/${room.room_images[0]}`
              : ''; // Ảnh mặc định nếu không có ảnh
    
          return { ...room, roomImage }; // Thêm roomImage vào đối tượng room
        });

        setRooms(updatedRooms);
        console.log('Filtered rooms:', data);
      };
  
      fetchData();
    }, [location, propertyType, priceRange, area, keyword]);
    // Phần dropdown hiển thị 
      const [locationSearch, setLocationSearch] = useState("all");
       const [propertyTypeSearch, setPropertyTypeSearch] = useState("all");
       const [priceRangeSearch, setPriceRangeSearch] = useState("all");
       const [areaSearch, setAreaSearch] = useState("all");
       const [keywordSearch, setKeywordSearch] = useState("");
       const navigate = useNavigate();
       const [roomInfo, setRoomInfo] = useState([]);
       const [sortKey, setSortKey] = useState('price');

       const navigateToSearch = (searchKeyword) => {
        const path = `/user/home/${locationSearch || "all"}/${propertyTypeSearch || "all"}/${
          priceRangeSearch || "all"
        }/${areaSearch || "all"}?q=${encodeURIComponent(searchKeyword || "")}`;
        navigate(path);
      };
      // Địa điểm
      const locationItems = [
        { label: "Hà Nội", key: "ha-noi" },
        { label: "TP.HCM", key: "ho-chi-minh" },
        { label:"Đà năng", key:"da-nang"},
        {label:"Hải Phòng", key:"hai-phong"},
        {label:"Huế",key:"hue"}
      ];
    
      const handleLocationChange = ({ key }) => {
        setLocationSearch(key);
      };
    
      const locationMenuProps = {
        items: locationItems,
        onClick: handleLocationChange,
      };
      // Loại nhà
      const propertyTypeItems = [
        { label: "Phòng trọ", key: "phongtro" },
        { label: "Nhà nguyên căn", key: "nhanguyencan" },
        { label: "Căn hộ chung cư", key: "chungcu" },
        { label: "Chung cư mini", key: "chungcumini" },
        { label: "Căn hộ dịch vụ" ,key:"canhodichvu"}
      ];
      const handlePropertyTypeChange = ({ key }) => {
        setPropertyTypeSearch(key);
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
        setPriceRangeSearch(key);
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
        setAreaSearch(key);
      };
      const areaMenuProps = {
        items: areaItems,
        onClick: handleAreaChange,
      };
      // Thanh tìm kiếm
    
      const onSearch = (value) => {
        setKeywordSearch(value);
        navigateToSearch(value);
      };
      

    return (
        <div className="flex w-full">
        <div className ="flex flex-col h-full w-[70%] ml-9 mr-4">
        <h1 className="text-2xl font-semibold mt-6">📋 Có {rooms.length} kết quả tìm kiếm</h1>
        <Search 
        placeholder="input search text"
        onSearch={onSearch}
         style={{  marginTop:"20px" , width:"70%"}} />
         <div className="flex items-center mt-4 space-x-6 h-10">
        <Dropdown
    menu={propertyTypeMenuProps }
    placement="bottomLeft"
  >
    <a onClick={e => e.preventDefault()} className="flex items-center h-full px-4 py-2 border rounded-[10px] hover:bg-gray-100">
      <Space>
        Loại nhà
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>

  <Dropdown
    menu={priceRangeMenuProps}
    placement="bottomLeft"
  >
    <a onClick={e => e.preventDefault()} className="flex items-center h-full px-4 py-2 border rounded-[10px] hover:bg-gray-100">
      <Space>
        Mức giá
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>

  <Dropdown
    menu={locationMenuProps}
  >
    <a onClick={e => e.preventDefault()} className="flex items-center h-full px-4 py-2 border rounded-[10px] hover:bg-gray-100">
      <Space>
        Địa điểm
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
  <Dropdown
    menu={areaMenuProps}
  >
    <a onClick={e => e.preventDefault()} className="flex items-center h-full px-4 py-2 border rounded-[10px] hover:bg-gray-100">
      <Space>
        Diện tích
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
</div>
   <div className="mt-4 h-full w-[30%] rounder-[10px]">
   <Segmented
  block
  options={[
    {
      label: <span className="flex items-center h-full py-1 text-base">Giá</span>,
      value: 'price',
    },
    {
      label: <span className="flex items-center h-full py-1 text-base">Thời gian</span>,
      value: 'time',
    },
  ]}
  value={sortKey}
  onChange={(val) => {
    setSortKey(val);
    const sortedData = [...rooms].sort((a, b) => {
      if (val === 'price') return a.price_per_month - b.price_per_month;
      return 0;
    });

    setRooms(sortedData);
  }}
/>
  </div>
  <div className="mb-4">
  <List
  itemLayout="vertical"
  size="large"
  pagination={{
    onChange: page => {
      console.log(page);
    },
    pageSize: 3,
    align: 'center', 
  }}
  dataSource={rooms}
  renderItem={item => (
    <List.Item
      key={item.id}
      className="h-full"
    >
   <Link
    to={`/user/room-details/${item.id}`}
  > 
      <div className="flex p-0 h-[23vh] mt-5">
        <div className="flex w-[40%] items-center justify-center">
        <img
          width={272}
          alt="logo"
          className="rounded w-[272px] h-[230px] py-7 "
          src={item.roomImage || "https://via.placeholder.com/272x240"} // Sử dụng roomImage từ API
        />
        </div>
        <div className="flex flex-col justify-center w-[60%]">
          <List.Item.Meta
         title={<a href={item.id} className="font-bold">{item.room_name}</a>}
            description={
                <>
                <div className="flex">
                  <p className="text-gray-600 w-1/3">{item.price_per_month} triệu</p>
                  <p className="text-gray-600 w-1/3 truncate">  {item.address?.split(',').slice(-2).join(',').trim()}
                  </p>
                  <p className="text-sm text-gray-500 w-1/3 ml-3">{item.area}m2</p>
                </div>
                </>
              }
          />
          
          <p className="text-gray-700 line-clamp-3">
          {item.description}
          </p>
          <div className=" flex mt-6 justify-between">
          <div className="w-1/2">
          <List.Item.Meta
            avatar={<Avatar src={item.RentPost?.User?.profile_picture} />}
            title={item.RentPost?.User?.lastName}
            />
        </div>
        <div className="w-1/2 flex justify-end">
         <p className="text-base from-neutral-900">
         {"0" + item.RentPost?.User?.phone_number}
        </p>
        </div>

           </div>
        </div>
      </div>
      </Link>
    </List.Item>
  )}
  
/>
</div>
        </div>
        <div className="flex items-center justify-center w-1/3 mt-14 mb-14 mr-8 ml-5">
        {rooms.length > 0 && (
  <MapboxComponent2
    locations={rooms.map(room => ({
      address: room.address,
      price: room.price_per_month
    }))}
  />
)}
</div>
        </div>
    );
    }
export default SearchPageTest;