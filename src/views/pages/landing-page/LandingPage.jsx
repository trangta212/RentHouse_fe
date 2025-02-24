import React, { useState } from "react";
import "../landing-page/landingPage.css";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space } from "antd";
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
          <a href="#">Home</a>
          <a href="#">Contact Us</a>
          <a href="#">Login</a>
          <a href="#">Signup</a>
          <div className="language-selector">
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  EN
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </nav>
      </header>
      <main>
        <div className="rightLand">
          <h1 className="titleLand">
            Find House With <br />
            <span>Rent Space</span>
          </h1>
          <p>
            We provide a seamless platform to connect you with the perfect
            rooms. Whether you're a student, a working professional, or a
            family, you'll effortlessly find your ideal place with clear,
            transparent information and a simple process. Start your journey to
            find your new home today!
          </p>
          <button>Start Now</button>
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

