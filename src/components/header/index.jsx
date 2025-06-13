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
import Badge from "@mui/material/Badge";
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
import { getUserInfo } from "../../api/userApi";
import { getListNotification } from "../../api/notificationApi";
import { getConversations } from "../../api/message";
import { isAuthenticated } from "../../untils/auth"; // Giả định bạn có file này
import { useLocation } from "react-router-dom";


const Header = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuthStore();
  const [showFavorites, setShowFavorites] = useState(false);
  const [notification, setNotification] = useState(false); 
  const token = sessionStorage.getItem("authToken");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Fetch unread notifications
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!token) return;
      
      try {
        // Fetch notifications
        const notifications = await getListNotification();
        const unreadNotifs = notifications.filter(n => !n.is_read).length;
        setUnreadNotifications(unreadNotifs);

        // Fetch conversations
        const conversations = await getConversations();
        const unreadMsgs = conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
        setUnreadMessages(unreadMsgs);
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };

    fetchUnreadCounts();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, [token]);

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

  const handleOpenRent = () => {
    if (!isAuthenticated()) {
      message.info("Vui lòng đăng nhập để sử dụng tính năng này");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    navigate("/dashboard");
  }
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
  const [userInfo, setUserInfo] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const dataUser = await getUserInfo();
        setUserInfo(dataUser.data);
        if (dataUser?.data.profile_picture) {
          setFileList([
            {
              uid: "-1",
              name: "profile.jpg",
              status: "done",
              url: `http://localhost:8000/uploads/${dataUser.data.profile_picture}`, // đường dẫn ảnh gốc
            },
          ]);
        }
        if (!user) {
          useAuthStore.getState().setUser(dataUser.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }
  , []);
  

  return (
    <div>
      <div className="header">
        <div className="imageHeader">
          <Link to="/user/home" className="link">
            <img
              src={require("../../assets/images/logoweb.png")}
              alt="Logo"
              className="logo-Header"
            />
          </Link>
        </div>
        <div className="headerText" style={{ marginTop: "10px" }}>
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
            <Link to="/dashboard" className="link"  onClick={handleOpenRent}>
              <Typography sx={{ minWidth: 120, color: "black" }}>
                Quản lý 
              </Typography>
            </Link>
            <Typography sx={{ minWidth: 120, color: "black" }}>
              Tin tức
            </Typography>
          </Box>
        </div>
        <div className="headerButton">
          {user ? (
            <>
              <Tooltip title="Thông báo">
                <IconButton sx={{ p: 1, ml: 3, mr: 4 }} onClick={handleNotificationClick}>
                  <Badge badgeContent={unreadNotifications} color="error">
                    <FaBell style={{ fontSize: "22px", color: "#f0e68c" }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Tin nhắn">
                <IconButton sx={{ p: 1, mr: 4 }} onClick={handleMessagesClick}>
                  <Badge badgeContent={unreadMessages} color="error">
                    <TiMessages style={{ fontSize: "22px", color: "#3c39df" }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Tài khoản">
                <IconButton onClick={handleClick} sx={{ p: 0, marginRight: 1 }}>
                  <Avatar
                    alt={userInfo?.lastName || "User"}
                    sx={{ width: 34, height: 32 }}
                    src={
                      userInfo?.profile_picture
                        ? `http://localhost:8000/uploads/${userInfo.profile_picture}`
                        : "/default-avatar.png"
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate("/dashboard/thong-tin-ca-nhan")}>Hồ sơ</MenuItem>
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
            style={{ marginRight: "20px" }}
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