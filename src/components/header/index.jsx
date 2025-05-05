import React from "react";
import "./index.css";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Button, Flex } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { MdFavorite } from "react-icons/md";
import { HeartOutlined } from "@ant-design/icons";
import FavoriteList from "../favorite-list";
import NotificationList from "../notification-list";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { TiMessages } from "react-icons/ti";
import { disconnectSocket } from "../../chat/socket"; 
import { FaBell } from "react-icons/fa";




const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuthStore();
  const [showFavorites, setShowFavorites] = useState(false);
  const [notification, setNotification] = useState(false); 
  const token = sessionStorage.getItem("authToken");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    disconnectSocket();     
  };

  const handleFavoriteClick = () => {
    if (!token) {
      message.warning("Vui lòng đăng nhập để xem danh sách yêu thích!");
      return;
    }
    setShowFavorites(true);
  };
  const handleMessagesClick = () => {
    navigate('/user/chat'); // điều hướng đến trang tin nhắn
  };
  const handleNotificationClick = () => {
    setNotification(true);
  };
  return (
    <div>
      <div className="header">
        <div className="imageHeader">
          <img
            src={require("../../assets/images/logo.jpg")}
            alt="Logo"
            className="logo-Header"
          />
        </div>
        <div className="headerText"
          style={{
            marginTop: "10px",
          }}>
          <Box
            className="BoxHeader"
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Link to="/user/home" className="link">
              <Typography sx={{ minWidth: 120, color: "black" }}>
                Trang chủ
              </Typography>
            </Link>
            {/* <Tooltip title="Account settings"> */}
              {/* <IconButton
                onClick={handleClick}
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              > */}
              <Link to="/dashboard" className="link">
                <Typography sx={{ minWidth: 120, color: "black" }}>
                  Quản lý 
                </Typography>
              </Link>
              {/* </IconButton> */}
            {/* </Tooltip> */}
            <Typography sx={{ minWidth: 120, color: "black" }}>
              Về chúng tôi
            </Typography>
            <Typography sx={{ minWidth: 120, color: "black" }}>
              Tin tức
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </div>
        <div className="headerButton">
          {user ? (
            <>
            <Tooltip title="Thông báo">
             <IconButton sx={{ p: 1, ml: 3 ,mr:2}}
              onClick={handleNotificationClick}
             >
            <FaBell style={{ fontSize: "22px", color: "#f0e68c" }}
            />
           </IconButton>
            </Tooltip>
              <Tooltip title="Tài khoản">
                <IconButton onClick={handleClick} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    sx={{ width: 34, height: 32 }}
                    src={user.avatar || "/default-avatar.png"}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={() => navigate("/profile")}>Hồ sơ</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                className="signup-header"
                type="text"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                className="login-header"
                type="primary"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </>
          )}
          <Button
            className="push"
            type="primary"
            onClick={() => navigate("/user/push-information-page")}
          >
            Đăng bài
          </Button>
        </div>
        <div className="header-right">
          {token && (
          <FontAwesomeIcon 
          icon={faHeart} 
          className="mt-[20px] ml-5 text-xl text-red-500"
          onClick={handleFavoriteClick}
          style={{ fontSize: "20px", cursor: "pointer" }}
          />  
          )}

        </div>
        {token && (
        <TiMessages 
          className="mt-[20px] ml-5 text-xl text-[#4caf4f]"
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={handleMessagesClick}
        />
        )}
      </div>
      <FavoriteList
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      <NotificationList
        visible={notification}
        onClose={() => setNotification(false)}
      />
    </div>
  );
};
export default Header;