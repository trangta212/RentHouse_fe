// src/pages/dashboard/Post.jsx
import React from "react";
import {Button} from "antd";
import { Input } from 'antd';
import { useState } from "react";
import { Dropdown, Space, Typography } from 'antd';
import {Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { detailRoomInformation  } from "../../../api/requestHomeApi";
import { useEffect } from "react";
import {updatePostInformationByUser} from "../../../api/postRent.jsx";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';





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
        // Chọn ảnh đầu tiên làm mặc định
           const roomImage =
           dataRoom.dataRoom.room_images && dataRoom.dataRoom.room_images.length > 0
              ? dataRoom.dataRoom.room_images[0].startsWith("https://")
                ? dataRoom.dataRoom.room_images[0]
                : `http://localhost:8000/uploads/${dataRoom.dataRoom.room_images[0]}`
              : ''; // Ảnh mặc định nếu không có ảnh
      setSelectedImage(roomImage); // Chọn ảnh đầu tiên làm mặc định
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
        const formData = new FormData();
        formData.append("room_name", informationListRoom.room_name);
        formData.append("address", informationListRoom.address);
        formData.append("price_per_month", informationListRoom.price_per_month);
        formData.append("area", informationListRoom.area);
        formData.append("description", informationListRoom.description);
        formData.append("type", informationListRoom.type);
        formData.append("electricity_bill", informationListRoom.electricity_bill);
        formData.append("water_bill", informationListRoom.water_bill);
        formData.append("extensions", informationListRoom.extensions);
        formData.append("full_furnishing", informationListRoom.full_furnishing);
        if (fileList && Array.isArray(fileList)) {
          fileList.forEach((file, index) => {
            if (file && file.originFileObj instanceof File) {
              formData.append("room_images", file.originFileObj);
              console.log(`Added room_images[${index}]:`, file.originFileObj.name);
            } else {
              console.warn(`Skipped fileList[${index}]: Not a valid File`, file);
            }
          });
        } else {
          console.warn("fileList is empty or not an array:", fileList);
        }
        // TODO: thêm các trường còn thiếu nếu cần: type, điện, nước, nội thất,...
  
       const response = await updatePostInformationByUser(id, formData);
      setIsEditing(false);
      alert(response.data.message || "Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật bài đăng:", error);
      alert(error.message || "Cập nhật thất bại!");
    }
  };

  const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    
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
      // const fileNames = newFileList.map((file) => file.name); // Lấy danh sách tên file
      // setValue("room_images", fileNames); // ⬅️ Cập nhật vào react-hook-form
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
                    <h1 className="text-black/70 mb-1"> Giá điện(1 số)</h1>
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
                    <h1 className="text-black/70 mb-1"> Giá nước(1 khối)</h1>
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
  <Dropdown
    menu={{
      items: [
        { key: "true", label: "Đầy đủ" },
        { key: "false", label: "Không đầy đủ" },
      ],
      onClick: ({ key }) => {
        if (isEditing) {
          setInformationListRoom({
            ...informationListRoom,
            full_furnishing: key === "true", // Lưu giá trị boolean
          });
        }
      },
    }}
    disabled={!isEditing} // Chỉ cho phép chọn khi isEditing = true
  >
    <Typography.Link onClick={(e) => e.preventDefault()}>
      <Space
        className={`bg-gray-100 px-4 py-3 block rounded-xl ${
          !isEditing ? "cursor-not-allowed text-gray-500" : ""
        }`}
      >
        {informationListRoom.full_furnishing === true
          ? "Đầy đủ"
          : informationListRoom.full_furnishing === false
          ? "Không đầy đủ"
          : "Chọn nội thất"}
      </Space>
    </Typography.Link>
  </Dropdown>
</div>
                   </div>
                    </div>
                    <div className="w-1/2">
                    <h1 className="text-black/70 mb-1"> Tiện ích</h1>
                    <div className="rounded-xl w-3/4">
                    <Input
                   placeholder="Basic usage"
                   size="large" // tăng chiều cao và font
                   bordered={false} // bỏ viền
                   readOnly={!isEditing}
                   className={`bg-gray-100 px-4 py-3 ${!isEditing ? "cursor-not-allowed" : ""}`}
                   value={informationListRoom.extensions || "khong co"} // Truyền giá trị vào ô nhập
                  onChange={(e) => {
                    if (isEditing) {
                      setInformationListRoom({
                        ...informationListRoom,
                        extensions: e.target.value, // Cập nhật giá trị khi chỉnh sửa
                      });
                    }
                  }}
                    />
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
                    <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                          >
                            {Array.isArray(fileList) && fileList.length >= 5 ? null : uploadButton}
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
