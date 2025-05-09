import React from "react";
import UploadImg from "../../../components/upload-img/upload.jsx";
import { Button, Input, Dropdown, Space, Typography, Image , Upload} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {updatePostInformationByUser} from "../../../api/postRent.jsx";
import { detailRoomInformation  } from "../../../api/requestHomeApi";
import { MdAutoFixHigh } from "react-icons/md";
import {getUserInfo,updateUserInfo} from "../../../api/userApi.js";


export default function UserInformation() {
      const [isEditing, setIsEditing] = useState(false);
      const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

        const { id } = useParams();
        
    
        const handleEditClick = () => {
          setIsEditing(true);
        };
        const [informationListRoom, setInformationListRoom] = useState([]);
        const [userInfo, setUserInfo] = useState(null);
    
// Lấy thông tin của user
      useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const dataInfor = await getUserInfo();
            setUserInfo(dataInfor.data);
            // console.log("Thông tin người dùng:", dataInfor.data);
            if (dataInfor?.data.profile_picture) {
                setFileList([
                  {
                    uid: "-1",
                    name: "profile.jpg",
                    status: "done",
                    url: `http://localhost:8000/uploads/${dataInfor.data.profile_picture}`, // đường dẫn ảnh gốc
                  },
                ]);
              }
            
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        };
    
        fetchUserInfo();
      }
        , []);
        const beforeUpload = (file) => {
            setFileList([...fileList, file]);
            return false;
          };
        
        const getBase64 = (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });
        

        const handlePreview = async (file) => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
            }
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
          };
          const handleChange = ({ fileList: newFileList }) => {
            setFileList(newFileList);
          };
          const uploadButton = (
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          );
        
        
// Update thông tin của user
        const handleUpdateUser = async () => {
            try {
                const formData = new FormData();
                formData.append("lastName", userInfo.lastName);
                formData.append("phone_number", "0" + userInfo.phone_number);
                formData.append("email", userInfo.email);
                if (fileList[0] && fileList[0].originFileObj) {
                    formData.append("profile_picture", fileList[0].originFileObj);
                  }
                  else {
                    formData.append("profile_picture", userInfo.profile_picture);
                  }
                  console.log(formData);
            const response = await updateUserInfo(formData);
            setIsEditing(false);
            alert("Cập nhật thành công!");
            console.log(response);
            } catch (error) {
            console.error("Lỗi cập nhật thông tin người dùng:", error);
            alert(error.message || "Cập nhật thất bại!");
            }
        };

  return (
    <div>
    <div className="bg-white w-full h-full rounded-xl p-14">
        <div className ="flex justify-end">
             <Button onClick={handleEditClick} className="px-4 py-5 rounded-2xl">
                <span className="text-white font-semibold text-base">Sửa</span>
                <MdAutoFixHigh />
             </Button>
        </div>
            <div className="flex items-center justify-center">
                <div className="flex space-x-4">
  
                  <Upload
  listType="picture-card"
  fileList={fileList}
  onPreview={handlePreview}
  onChange={handleChange}
  beforeUpload={beforeUpload}
>
  {Array.isArray(fileList) && fileList.length >= 1 ? null : uploadButton}
</Upload>

{previewImage && (
  <Image
    wrapperStyle={{ display: "none" }}
    preview={{
      visible: previewOpen,
      onVisibleChange: (visible) => setPreviewOpen(visible),
      afterOpenChange: (visible) =>
        !visible && setPreviewImage(""),
    }}
    src={previewImage}
  />
)}

                </div>
             </div>   
             <div className="mt-12 flex flex-col ml-24">
                <div className="flex">
                    <div className ="w-3/4">
                    <h1 className="text-black/70 mb-1"> Tên liên hệ</h1>
                    <div className="rounded-xl">
                     <Input
                  placeholder="Tên phòng"
                  size="large"
                  bordered={false}
                  readOnly={!isEditing}
                  value={userInfo?.lastName || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                        setUserInfo({
                        ...userInfo,
                        lastName: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                  className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                />
                   </div>
                    </div>
                </div>
                <div className="flex mt-7">
                    <div className="w-3/4">
                    <h1 className="text-black/70 mb-1"> Email</h1>
                    <div className="rounded-xl">
                    <Input
                  placeholder="Địa chỉ"
                  size="large"
                  bordered={false}
                  readOnly={!isEditing}
                  className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                  value={userInfo?.email || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                        setUserInfo({
                        ...userInfo,
                        email: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                />
                   </div>
                    </div>
                </div>
                <div className ="w-3/4 mt-7">
                    <h1 className="text-black/70 mb-1"> Số điện thoại</h1>
                    <div className="rounded-xl">
                     <Input
                  placeholder="Tên phòng"
                  size="large"
                  bordered={false}
                  readOnly={!isEditing}
                  value={userInfo?.phone_number || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                        setUserInfo({
                        ...userInfo,
                        phone_number: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                  className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                />
                   </div>
                    </div>
                    <div className ="w-3/4 mt-7">
                    <h1 className="text-black/70 mb-1"> Mật khẩu</h1>
                    <div className="rounded-xl">
                     <Input
                  placeholder="Mật khẩu"
                  size="large"
                  bordered={false}
                  readOnly={!isEditing}
                  value={informationListRoom.room_name || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                      setInformationListRoom({
                        ...informationListRoom,
                        room_name: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                  className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                />
                   </div>
                    </div>

                <div className="flex justify-end mt-10 space-x-5">
                <Link to="/dashboard/tin-dang">
                <Button className=" text-white px-10 py-5 rounded-2xl">
                    <span className="text-white font-semibold text-base">Huỷ</span>
                </Button>
                </Link>
                <Button onClick={handleUpdateUser} className=" text-white px-10 py-5 rounded-2xl">
                    <span className="text-white font-semibold text-base">Cập nhật</span>
                </Button>
                </div>
             </div>
         </div>    
    </div>
  );
}
