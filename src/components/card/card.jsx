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
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";

import { Row, Col } from "antd";
import { List } from "antd";
//collectionData (array): mảng chứa dữ liệu của 1 item cần có 3 trường id, name, place
//itemsNumber (int): số item tối đa hiển thị trong 1 hàng
//rowNumber (int): số hàng
//showIndicator (boolean): hiển thị đánh số trang

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

  const datasource = listHome.map((room, index) => (
    <Card key={index} sx={{ width: "80%", height: "120vh" }}>
      <Link to={`/user/room-details/${room.id}`}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ height: 200 }}
            image={coursImage}
            alt={room.room_name}
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
            height: "60%",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginBottom: "15px" }}
          >
            {room.room_name}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "center " }}
          >
            <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              style={{ fontSize: "20px" }}
            />
            <Typography
              variant="h6"
              sx={{ flex: 1, color: "#636364", fontWeight: "400" }}
            >
              {room.price_per_month
                ? `${room.price_per_month} triệu đồng/tháng`
                : "Chưa có giá"}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ flex: 1 }}
            >
              <LocationOn color="error" />
              <Typography variant="body1">
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
              WebkitLineClamp: 4, // Giới hạn 3 dòng
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {room.description || "Không có mô tả"}
          </Typography>
        </CardContent>
        <Divider />
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "red" }}>A</Avatar>}
          title="Anne Liza"
          subheader="Property Seller"
        />
      </Link>
    </Card>
  ));

  return (
    <Stack spacing={2}>
      <List
        grid={{ gutter: 10, column: 2 }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 8,
          style: { textAlign: "center" },
        }}
        dataSource={datasource}
        renderItem={(item) => (
          // <Col xs={24} sm={12} md={12} lg={12} >
          <List.Item style={{ marginBottom: "40px" }}>
            <List.Item.Meta />
            {item}
          </List.Item>
          // </Col>
        )}
        style={{ margin: "50px" }} // Căn giữa List
      />
      {/* </Row> */}
    </Stack>
  );
}

export default MediaCard;
