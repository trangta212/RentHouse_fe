import { BrowserRouter } from "react-router-dom";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./views/pages/landing-page/LandingPage.jsx";
import Login from "./views/pages/login/index.jsx";
import SignUp from "./views/pages/sign-up/index.jsx";
import "@fontsource/roboto"; // Import font Roboto
import { ConfigProvider } from "antd";
import UserRoute from "./views/routes/userRouter.js";
import ReceiptPage from "./views/pages/receipt/index.jsx";

const theme = {
  token: {
    fontFamily: "Poppins, sans-serif",
  },
};

function App() {
  // Giả sử bạn đã có thông tin user từ context hoặc redux store
  const currentUser = {
    id: 1,
    username: "User1",
    avatar: "path/to/avatar",
  };

  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route
            path="/api/v1/payment/vnpay-return"
            element={<ReceiptPage />}
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
