// layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { Input } from "antd";
import { useNavigate } from "react-router-dom"
import { Avatar } from 'antd';
import {getUserInfo} from "../../api/userApi.js";
import { useEffect, useState } from 'react';
import { Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';




const { Search } = Input;

export default function MainLayout() {
    const navigate = useNavigate();
    const navigateToSearch = (searchKeyword) => {
        const path = `/user/home/${"all"}/${ "all"
        }/${"all"}/${"all"}?q=${encodeURIComponent(
          searchKeyword || ""
        )}`;
        navigate(path);
      };
    const onSearch = (value) => {
        // setKeyword(value);
        navigateToSearch(value);
      };
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const dataBack = await getUserInfo();
            setUserInfo(dataBack.data);
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        };
    
        fetchUserInfo();
      }, []);
    
    
    return (
      <>
      
     <div className="main-layout-header  flex top-0 w-full p-2 items-center justify-between bg-[#f0f1f8]">
      <div className="w-2/5  ml-3">
    <Search 
    placeholder="input search text" 
    onSearch={onSearch}
    className="p-3"
    size="large"
    enterButton={
        <Button
          type="primary"
          style={{ backgroundColor: '#5a67ba'}} // đỏ ví dụ
          icon={<SearchOutlined />} // Thêm biểu tượng tìm kiếm
        >
        </Button>
      }
    />
    </div>
    <div className="space-x-2 mr-3">
    {<Avatar src={`http://localhost:8000/uploads/${userInfo?.profile_picture}` || "khong co thong tin"} />}
    <a href="https://ant.design">
    {userInfo?.lastName || "Không có thông tin"}
    </a>
    </div>
     </div>
        <div className="main-layout-content" style={{ marginTop: "30px", padding: "20px", marginLeft: "40px", marginRight: "40px"}}>
         <Outlet />
        </div>
      </>
    );
  }
