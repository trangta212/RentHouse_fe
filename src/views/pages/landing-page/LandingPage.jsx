import React, { useState } from "react";
import "../landing-page/landingPage.css";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const LandingPage = () => {
  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
    console.log("click", e);
  };
  const items = [
    {
      label: "English",
      key: "1",
    },
    {
      label: "Vietnamese",
      key: "2",
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate("/user/home"); // ví dụ: "/dashboard"
  };
  return (
    <div className="landingPage">
      <header>
        <div>
          <img
            src={require("../../../assets/images/logo.jpg")}
            alt="Logo"
            className="logo"
          />
        </div>
        
      <nav>
        <Link to="/user/home">Trang chủ</Link>
        <Link to="/login">Đăng ký</Link>
        <Link to="/sign-up">Đăng nhập</Link>
      </nav>
      </header>
      <main style={{height:"100%"}}>
        <div className="rightLand">
          <h1 className="titleLand">
            Tìm nhà nhanh chóng <br />
            <span>HomeNest</span>
          </h1>
          <p>
          Chúng tôi cung cấp một nền tảng thuận tiện giúp bạn kết nối với những phòng trọ lý tưởng. 
          Dù bạn là sinh viên, người đi làm hay một gia đình, bạn sẽ dễ dàng tìm được nơi ở phù hợp với thông tin rõ ràng, minh bạch và quy trình đơn giản. 
          Hãy bắt đầu hành trình tìm kiếm ngôi nhà mới của bạn ngay hôm nay!
          </p>
            <button onClick={handleStartNow}>Bắt đầu ngay</button>
        </div>
        <div className="leftLand">
          <img
            src={require("../../../assets/images/landing.png")}
            alt="images"
            className="imagesland"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

