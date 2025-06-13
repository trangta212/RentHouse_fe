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
import { AuthProvider } from "./context/authContext.js";
import DashboardLayout from "./components/dash-board/DashBoard.jsx";
import MainLayout from "./components/main-layout/MainLayout.jsx";
import Overview from "./views/pages/overview/Overview.jsx";
import Post from "./views/pages/post/post.jsx";
import UpdatePost from "./views/pages/update-post/index.jsx";
import UserInformation  from "./views/pages/user-information/index.jsx";
import ContractInformation from "./views/pages/contract-information/index.jsx";
import { isAuthenticated } from "./untils/auth";

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="overview" />} />
            <Route path="overview" element={<Overview />} />
            <Route path="tin-dang" element={<Post />} />
            <Route path="update-tin-dang/:id" element={<UpdatePost />} />
            <Route path="thong-tin-ca-nhan" element={<UserInformation />} />
            <Route path="hop-dong" element={<ContractInformation />} />
          </Route>
          <Route
            path="/api/v1/payment/vnpay-return"
            element={<ReceiptPage />}
          />
          <Route path="/api/v1/payment/momo-return" element={<ReceiptPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ConfigProvider>

  );
}

export default App;
