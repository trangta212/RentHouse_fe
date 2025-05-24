import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { LocationOn } from "@mui/icons-material";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CardManageHorizontal({ listHome = [] }) {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300; // Số px mỗi lần scroll
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const datasource = listHome.map((room, index) => {
    const isFavorite = favoriteRooms.includes(room.id);

    const handleFavoriteClick = async () => {
      try {
        const updatedFavorites = isFavorite
          ? favoriteRooms.filter((id) => id !== room.id)
          : [...favoriteRooms, room.id];
        setFavoriteRooms(updatedFavorites);
        // Giữ nguyên logic gọi API nếu cần
      } catch (error) {
        console.error("Error adding favorite room:", error);
      }
    };

    const roomImage =
      room?.Room?.room_images && room?.Room?.room_images.length > 0
        ? room.Room.room_images[0].startsWith("https://")
          ? room.Room.room_images[0]
          : `http://localhost:8000/uploads/${room.Room.room_images[0]}`
        : "default-image-url"; // Ảnh mặc định

    return (
      <Card
        key={index}
        sx={{
          width: 320,
          minWidth: 280,
          height: "420px",
          marginRight: 2,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
       
        <CardMedia
            component="img"
            sx={{ height: 180 }}
            image={roomImage}
            alt={room.Room.room_name}
        />
          <FontAwesomeIcon
            icon={faHeart}
            style={{
              position: "absolute",
              top: 10,
              left: 20,
              fontSize: "24px",
              cursor: "pointer",
              color: isFavorite ? "red" : "gray",
            }}
            onClick={handleFavoriteClick}
          />
          </Box>
        <CardContent sx={{ height: "40%", overflow: "hidden" }}>
        <Link to={`/user/room-details/${room.Room.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            sx={{
              marginTop: "5px",
              marginBottom: "8px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {room.Room.room_name}
          </Typography>
            </Link>

          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center" sx={{ gap: "6px", width: "45%" }}>
              <FontAwesomeIcon icon={faMoneyCheckDollar} style={{ fontSize: "14px" }} />
              <Typography
                sx={{
                  color: "#636364",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {room.Room.price_per_month
                  ? `${room.Room.price_per_month} triệu đồng / tháng`
                  : "Chưa có giá"}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, width: "45%" }}>
              <LocationOn color="error" fontSize="small" />
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {room.Room.address || "Không có địa chỉ"}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              marginTop: "12px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {room.Room.description || "Không có mô tả"}
          </Typography>
        </CardContent>

        <Divider sx={{ marginTop: "12px", marginBottom: "10px" }} />
                <CardHeader
        sx={{ height: "8%", marginTop: "5px" }}
        avatar={
            <Avatar
            src={
                room?.User?.profile_picture
                ? room.User.profile_picture.startsWith("http")
                    ? room.User.profile_picture
                    : `http://localhost:8000/uploads/${room.User.profile_picture}`
                : undefined
            }
            >
            {room?.User?.lastName?.charAt(0).toUpperCase() || "?"}
            </Avatar>
        }
        title={room?.User?.lastName || "Không rõ người đăng"}
        subheader={room?.User?.email || "Không rõ người đăng"}
        />
      </Card>
    );
  });

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <IconButton
        onClick={() => handleScroll("left")}
        sx={{
          position: "absolute",
          top: "40%",
          left: 0,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.7)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          padding: 1,
          gap: 2,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: 4 },
          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",
        }}
      >
        {datasource}
      </Box>

      <IconButton
        onClick={() => handleScroll("right")}
        sx={{
          position: "absolute",
          top: "40%",
          right: 0,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.7)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </IconButton>
    </Box>
  );
}

export default CardManageHorizontal;
