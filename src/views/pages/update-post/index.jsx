// src/pages/dashboard/Post.jsx
import React from "react";
import {Button} from "antd";
import { Input } from 'antd';
import UploadImg from "../../../components/upload-img/upload.jsx";
import { useState } from "react";
import { Dropdown, Space, Typography } from 'antd';
import {Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { detailRoomInformation  } from "../../../api/requestHomeApi";
import { useEffect } from "react";
import {updatePostInformationByUser} from "../../../api/postRent.jsx";
import { ExclamationCircleOutlined } from '@ant-design/icons';






const itemsType = [
    {
      key: '1',
      label: 'Item 1',
    },
    {
      key: '2',
      label: 'Item 2',
    },
    {
      key: '3',
      label: 'Item 3',
    },
  ];

export default function UpdatePost() {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    

    const handleEditClick = () => {
      setIsEditing(true);
    };
    const [informationListRoom, setInformationListRoom] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

 const fetchListHomeDetail = async () => {
    try {
      const dataRoom = await detailRoomInformation(id);
      if (dataRoom.dataRoom.room_images) {
        const images = dataRoom.dataRoom.room_images;
        setSelectedImage(dataRoom.dataRoom.room_images[0]); // Chọn ảnh đầu tiên làm mặc định
      }
      setInformationListRoom(dataRoom.dataRoom);
    } catch (error) {
      console.error("Failed to fetch list home: ", error);
    }
  };

  useEffect(() => {
    fetchListHomeDetail();
  }, [id]);

  const handleUpdatePost = async () => {
    try {
      const updatedData = {
        room_name: informationListRoom.room_name,
        address: informationListRoom.address,
        price_per_month: informationListRoom.price_per_month,
        area: informationListRoom.area,
        description: informationListRoom.description,
        // TODO: thêm các trường còn thiếu nếu cần: type, điện, nước, nội thất,...
      };
  
      await updatePostInformationByUser(id, updatedData);
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật bài đăng:", error);
      alert(error.message || "Cập nhật thất bại!");
    }
  };

  return (
    <div>
        <div className="bg-white w-full h-full rounded-xl p-14">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={selectedImage ||"khong co"} alt="Update Post" className="w-20 h-20 rounded-2xl" />
                    <p className="text-xl font-semibold text-black">{informationListRoom.room_name || "khong co"}</p>
                </div>
             <Button onClick={handleEditClick} className="px-4 py-5 rounded-2xl">
                <span className="text-white font-semibold text-base">Chỉnh sửa</span>
             </Button>
             </div>   
             <div className="mt-12 flex flex-col">
             <div className="flex items-center text-red-600 mb-8 text-base">
            <ExclamationCircleOutlined className="mr-2 text-xl" />
           <span>Lưu ý: Bạn chỉ có thể chỉnh sửa thông tin phòng trước khi xác nhận đặt cọc thành công</span>
           </div>
                <div className="flex">
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Tên phòng</h1>
                    <div className="rounded-xl w-3/4">
                     <Input
                  placeholder="Tên phòng"
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
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Loại phòng</h1>
                    <div className="rounded-xl w-3/4">
                  <Dropdown
                 menu={{
                   items: itemsType,
                   selectable: true,
                  defaultSelectedKeys: ['3'],
                    }}
                  disabled={!isEditing} // <-- Chỉ cho chọn khi isEditing = true
                  >
    <Typography.Link onClick={(e) => e.preventDefault()}>
      <Space
        className={`bg-gray-100 px-4 py-3 block rounded-xl ${
          !isEditing ? 'cursor-not-allowed text-gray-500' : ''
        }`}
      >
        Selectable
      </Space>
    </Typography.Link>
  </Dropdown>
</div>

                    </div>
                </div>
                <div className="flex mt-7">
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Địa chỉ</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                  placeholder="Địa chỉ"
                  size="large"
                  bordered={false}
                  readOnly={!isEditing}
                  className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                  value={informationListRoom.address || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                      setInformationListRoom({
                        ...informationListRoom,
                        address: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                />
                   </div>
                    </div>
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Giá phòng</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                   value={informationListRoom.price_per_month || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                      setInformationListRoom({
                        ...informationListRoom,
                        price_per_month: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                    />
                   </div>
                    </div>
                </div>
                <div className="flex mt-7">
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Giá điện</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                    />
                   </div>
                    </div>
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Giá nước</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                    />
                   </div>
                    </div>
                </div>
                <div className="flex mt-7  space-x-28">
                    <div className="w-2/5 flex justify-between">
                    <div className="w-2/4">
                    <h1 className="text-black/70 mb-1"> Diện tích</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                     value={informationListRoom.area || "khong co"} // Truyền giá trị vào ô nhập
                    onChange={(e) => {
                        if (isEditing) {
                            setInformationListRoom({
                            ...informationListRoom,
                            area: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                            });
                        }
                        }   
                    }
                    />
                    </div>
                    
                   </div>
                   <div className="w-2/4">
                    <h1 className="text-black/70 mb-1"> Nội thất</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                    />
                    </div>  
                   </div>
                    </div>
                    <div className="w-2/5 flex justify-between">
                    <div className="w-2/4">
                    <h1 className="text-black/70 mb-1"> Phòng ngủ</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   type="number" // Chỉ cho phép nhập số
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                    />
                    </div>
                    
                   </div>
                   <div className="w-2/4">
                    <h1 className="text-black/70 mb-1"> Phòng vệ sinh</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   type="number" // Chỉ cho phép nhập số
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                    />
                    </div>  
                   </div>
                    </div>
                </div>
                <div className="flex flex-col mt-7">
                <h1 className="text-black/70 mb-1"> Mô tả</h1>
                <div className="w-[88%]">
                <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-10 ${!isEditing ? "cursor-not-allowed" : ""}`}
                     value={informationListRoom.description || "khong co"} // Truyền giá trị vào ô nhập
                    onChange={(e) => {
                        if (isEditing) {
                            setInformationListRoom({
                            ...informationListRoom,
                            description: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                            });
                        }
                        }
                    }
                    />
                   </div> 
                </div>
                <div className="flex flex-col  mt-7">
                <h1 className="text-black/70 mb-1"> Hình ảnh</h1>
                <div className=" flex justify-center">
                <UploadImg />
                </div>
                </div>
                <div className="flex justify-end mt-7 space-x-5">
                <Link to="/dashboard/tin-dang">
                <Button className=" text-white px-10 py-5 rounded-2xl">
                    <span className="text-white font-semibold text-base">Huỷ</span>
                </Button>
                </Link>
                <Button onClick={handleUpdatePost} className=" text-white px-10 py-5 rounded-2xl">
                    <span className="text-white font-semibold text-base">Cập nhật</span>
                </Button>
                </div>
             </div>
         </div>         
    </div>
  );
}
