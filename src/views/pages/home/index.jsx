import React from 'react';
import ReactDOM from 'react-dom';
import MediaCard from '../../../components/card/card.jsx';
import CarouselComponent from '../../../components/carousel/carousel.jsx';
import CardPaper from '../../../components/card_peper/cardpeper.jsx';
import img1 from "../../../assets/images/cours.jpg";
import img2 from "../../../assets/images/cours2.jpg";
import img3 from "../../../assets/images/cours3.jpg";
import img4 from "../../../assets/images/cours4.jpg";
import { AudioOutlined , SearchOutlined } from '@ant-design/icons';
import {  Flex } from 'antd';
import { Input} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
import './index.css';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography'
import AccessTimeIcon from "@mui/icons-material/AccessTime";



const { Search } = Input;
  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };
  const items = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    }
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );
  const onSearch = (value, _e, info) => console.log(info?.source, value);

const HomePage =()=>{
         const images = [img1, img2, img3, img4]; 
        const [selectedButton, setSelectedButton] = useState(null);

        const handleButtonClick = (buttonName) => {
          setSelectedButton(buttonName); // Cập nhật nút đang được chọn
        };
         
        

    return(
        <div>
              <div className="home">
              <div className="carousel-container">
              <CarouselComponent images={images} width="100%" height="90vh" />
              <div className="search-container">
              <Dropdown menu={menuProps}  className="dropdown-custom">
             <Button size="large"  className="button-custom">
              <Space>
               Địa điểm 
             <DownOutlined />
            </Space>
           </Button>
           </Dropdown>
                <Search className ="search-custom"
               placeholder="Nhập từ khóa tìm kiếm"
                 allowClear
                 onSearch={onSearch}
                style={{
                width: 1000,
                height: 40,
                }}
                />
               </div>
               <div className ="NavFilterHomePage">
               <Flex wrap gap={40} className ="NavFilterHomePage">
               <Button
        onClick={() => handleButtonClick("phongtro")}
        style={{
          backgroundColor: selectedButton === "phongtro" ? "#4caf4f" : "",
        }}
      >
        Phòng trọ
      </Button>

      <Button
        onClick={() => handleButtonClick("nhanguyencan")}
        style={{
          backgroundColor: selectedButton === "nhanguyencan" ? "#4caf4f" : "",
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
          backgroundColor: selectedButton === "chungcumini" ? "#4caf4f" : "",
        }}
      >
         Chung cư mini
      </Button>
               </Flex>
               </div>
               <h1 className ="titleListHomePage">Các phòng trọ phổ biến</h1>
               <div className="card-list-home-container-Homepage">
               <MediaCard />
               </div>
                <h1 className ="titleListHomePage">Các tin tức liên quan</h1>
                <div className="paper-homepage-container">
                <div className ="paper-homepage-container-center">
                <CardPaper/>
                </div>
                <div className ="paper-homepage-container-list">

                <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                 <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
               primary={
                 <Typography variant="h7"> {/* Điều chỉnh cỡ chữ ở đây */}
                  Giá trị chung cư sau Tết Nguyên Đán
                </Typography>
                }
                secondary={
               <div style={{ display: "flex", alignItems: "center", gap: "10px" , marginTop: "10px"}}>
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

    )
}
export default HomePage;