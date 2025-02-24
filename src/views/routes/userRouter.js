import { Routes, Route , Navigate } from "react-router-dom";

import HomePage from "../pages/home/index.jsx";
import DetailRoom from "../pages/detailroom/index.jsx";
import Header from '../../components/header/index.jsx';
import Footer from '../../components/footer/index.jsx';

function UserRoute() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/room-details/:id" element={<DetailRoom />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UserRoute;