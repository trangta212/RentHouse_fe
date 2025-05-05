import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import coursImage from "../../assets/images/cours.jpg";
import { CardHeader, Avatar, IconButton } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { useState } from "react";
import { LocationOn } from "@mui/icons-material";
import { listHomeInformation } from "../../api/requestHomeApi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { addFavoriteRooms } from "../../api/favoriteApi";

import { List } from "antd";

function MediaCard() {
  const [liked, setLiked] = useState(false); // State để lưu trạng thái yêu thích

  const handleLike = () => {
    setLiked(!liked);
  };
  const [listHome, setListHome] = useState([]); // Chuyển thành mảng

  const fetchListHome = async () => {
    try {
      const homelist = await listHomeInformation();
      setListHome(homelist.listRoom);
    } catch (error) {
      console.error("Failed to fetch list home: ", error);
    }
  };

  useEffect(() => {
    fetchListHome();
  }, []);
  // Xử lý đoạn yêu thích
  const [favoriteRooms, setFavoriteRooms] = useState([]); // Danh sách roomIds
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích

  const datasource = listHome.map((room, index) => {
    const isFavorite = favoriteRooms.includes(room.id); // Kiểm tra trạng thái yêu thích

    const handleFavoriteClick = async () => {
      try {
        // Cập nhật danh sách roomIds
        const updatedFavorites = isFavorite
          ? favoriteRooms.filter((id) => id !== room.id) // Xóa roomId nếu đã yêu thích
          : [...favoriteRooms, room.id]; // Thêm roomId nếu chưa yêu thích

        setFavoriteRooms(updatedFavorites); // Cập nhật danh sách yêu thích
        setIsFavorite(!isFavorite);
        // Gửi API để lưu danh sách yêu thích
        const response = await addFavoriteRooms(updatedFavorites);
        console.log("API Response:", response);
      } catch (error) {
        console.error("Error adding favorite room:", error);
      }
    };

    return (
      <Card key={index} sx={{ width: "100%", height: "57vh" }}>
        {/* <Link to={`/user/room-details/${room.id}`}> */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ height: 210 }}
            image={room.room_images[0] || coursImage} // Sử dụng ảnh mặc định nếu không có ảnh
            alt={room.room_name}
          />

          <FontAwesomeIcon
            icon={faHeart}
            style={{
              position: "absolute",
              top: 10,
              left: 20,
              fontSize: "30px",
              cursor: "pointer",
              color: isFavorite ? "red" : "gray", // Đổi màu dựa trên trạng thái yêu thích
            }}
            className={`heart-icon ${isFavorite ? "favorite" : ""}`}
            onClick={handleFavoriteClick}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#4caf4f",
              color: "#fff",
              borderRadius: "20px",
            }}
          >
            Cho thuê
          </Button>
        </Box>

        <CardContent
          sx={{
            height: "25%",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            // component="div"
            // sx={{ marginBottom: "15px" }}
            component={Link} // Sử dụng Link để chuyển trang
            to={`/user/room-details/${room.id}`} // Đường dẫn đến trang chi tiết
            sx={{
              marginTop: "5px",
              marginBottom: "10px",
              textDecoration: "none",
              color: "inherit",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            {room.room_name}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
              alignItems: "center ",
              justifyContent: "space-between",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              sx={{
                gap: "8px",
                marginBottom: "8px",
                width: "40%",
              }} // khoảng cách giữa icon và chữ
            >
              <FontAwesomeIcon
                icon={faMoneyCheckDollar}
                style={{ fontSize: "15px" }}
              />
              <Typography
                sx={{
                  color: "#636364",
                  fontWeight: 400,
                  fontSize: "1.05rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                {room.price_per_month
                  ? `${room.price_per_month} triệu đồng / tháng`
                  : "Chưa có giá"}
              </Typography>
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ flex: 1, width: "40%" }}
            >
              <LocationOn color="error" />
              <Typography
                variant="body1"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "&:hover": {
                    textDecoration: "none",
                  },
                }}
              >
                {room.address || "Không có địa chỉ"}
              </Typography>
            </Stack>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              marginTop: "20px",
              marginBottom: "10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {room.description || "Không có mô tả"}
          </Typography>
        </CardContent>
        <Divider
          sx={{
            marginTop: "70px",
            marginBottom: "20px",
          }}
        />
        <CardHeader
          sx={{
            height: "8%",
            marginTop: "5px",
          }}
          avatar={<Avatar src={room?.RentPost?.User?.profile_picture} />}
          title={room?.RentPost?.User?.lastName || "Không rõ người đăng"}
          subheader={room?.RentPost?.User?.email || "Không rõ người đăng"}
        />
        {/* </Link> */}
      </Card>
    );
  });

  return (
    <Stack spacing={3}>
      <List
        grid={{
          gutter: 27,
          column: 3,
        }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 6,
          style: { textAlign: "center" },
          align: 'center', 
        }}
        dataSource={datasource}
        renderItem={(item) => (
          <List.Item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch", // đảm bảo các card có chiều cao đều
            }}
          >
            {item}
          </List.Item>
        )}
        style={{
          margin: "0 auto",
          // padding: "20px",
          padding: "20px 20px", // Thêm padding theo trục Y (trên và dưới)
          width: "95%",
          maxWidth: "1300px", // căn giữa theo chiều ngang tổng thể
        }}
      />
    </Stack>
  );
}

export default MediaCard;
