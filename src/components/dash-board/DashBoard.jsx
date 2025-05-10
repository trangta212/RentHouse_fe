// layouts/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaFileContract } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import MainLayout from "../main-layout/MainLayout.jsx";
import { FaClipboard } from 'react-icons/fa';





export default function DashboardLayout() {
  return (
    <div>
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "250px", background: "#e8eaf6", padding: "20px" }}>
        <div className="flex space-x-4 items-center mb-10 mt-10">
  <NavLink to="/user/home" className="flex items-center space-x-4">
    <img
      src={require("../../assets/images/logoweb.png")}
      alt="Logo"
      style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "50%" }}
    />
    <h1 className="text-xl font-semibold text-[#469349]"> HOMENEST</h1>
  </NavLink>
</div>
        <h2 className="text-lg font-semibold mb-4 text-[#507452]">Menu</h2>
        <nav>
  <div className="flex flex-col space-y-1">
    <NavLink
      to="/dashboard/overview"
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md ${
          isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
        }`
      }
    >
      <FaChartPie className="text-xl mr-3 text-indigo-600" />
      <span className="text-base text-black/80">Tổng quan</span>
    </NavLink>

    <NavLink
      to="/dashboard/tin-dang"
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md ${
          isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
        }`
      }
    >
      <MdOutlinePostAdd className="text-xl mr-3 text-indigo-600" />
      <span className="text-base text-black/80">Tin đăng</span>
    </NavLink>

    <NavLink
      to="/dashboard/hop-dong"
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md ${
          isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
        }`
      }
    >
      <FaFileContract className="text-xl mr-3 text-indigo-600" />
      <span className="text-base text-black/80">Hợp đồng</span>
    </NavLink>

    <NavLink
      to="/dashboard/thong-tin-ca-nhan"
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md ${
          isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
        }`
      }
    >
      <MdOutlineAccountCircle className="text-xl mr-3 text-indigo-600" />
      <span className="text-base text-black/80">Thông tin cá nhân</span>
    </NavLink>
    <NavLink
      to="/user/push-information-page"
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md ${
          isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
        }`
      }
    >
      <FaClipboard className="text-xl mr-3 text-indigo-600" />
      <span className="text-base text-black/80">Đăng tin</span>
    </NavLink>
  </div>
</nav>
      </aside>
      <div className="dashboard-content" style={{ flex: 1, background: "#F5F5F5"}}>
      <MainLayout />
      </div>
    </div>
    </div>
  );
}
