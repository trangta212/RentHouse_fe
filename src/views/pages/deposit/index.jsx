import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, InputNumber, Button, Upload, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CarouselComponent from "../../../components/carousel/carousel.jsx";
import img1 from "../../../assets/images/cours-up-2.jpg";
import img2 from "../../../assets/images/cours-up-1.jpg";
import img3 from "../../../assets/images/cours3.jpg";
import img4 from "../../../assets/images/cours4.jpg";
import { Radio } from "antd";
import vnpayLogo from "../../../assets/images/vn-pay.png";
import momo from "../../../assets/images/momo.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";



const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Chỉ được tải lên ảnh JPG/PNG!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Ảnh phải nhỏ hơn 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  const style = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };
const Deposit = () => {
  const images = [img1, img2, img3, img4];
  const { control, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  const onSubmit = (data) => {
    const fullData = {
      ...data,
      cccd_images: fileList.map(file => file.originFileObj),
    };
    console.log("Thông tin người dùng:", fullData);
    message.success("Gửi thông tin thành công!");
  };
  const [valuepayment, setValuePayment] = useState(1);
  const onChange = (e) => {
    setValuePayment(e.target.value);
  };
// Lấy thông tin 
const location = useLocation();
  useEffect(() => {
    if (location.state?.sender) {
        setSelectedDetail(location.state.sender);
    }
  }, [location]);

  return (
    <div className="p-10 w-full">
      <h1 className="text-2xl font-semibold">Thông tin đặt cọc của bạn</h1>
      <p className="mt-4">Hãy đảm bảo thông tin chính xác trước khi thanh toán</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex mt-8">
        <div className="w-2/3 pr-4">
          <div className="bg-[#fffced] rounded-[20px] p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin khách hàng</h2>

            {/* Họ tên */}
            <label className="font-semibold text-sm block mb-1">Họ tên (CMND/CCCD) <span className="text-red-500">*</span></label>
            <Controller
              name="fullNameIdentify"
              control={control}
              rules={{
                required: "Vui lòng nhập họ tên",
                pattern: { value: /^[A-Za-zÀ-ỹ\s]+$/, message: "Chỉ được nhập chữ cái" },
              }}
              render={({ field }) => (
                <Input {...field} className="rounded-3xl p-[10px] mb-2" placeholder="Nhập họ tên đầy đủ" />
              )}
            />
            {errors.fullNameIdentify && <p className="text-red-500">{errors.fullNameIdentify.message}</p>}

            {/* CCCD */}
            <label className="font-semibold text-sm block mt-4 mb-1">Số CMND/CCCD <span className="text-red-500">*</span></label>
            <Controller
              name="cccd"
              control={control}
              rules={{
                required: "Vui lòng nhập số CCCD",
                pattern: { value: /^\d{12}$/, message: "Phải đủ 12 chữ số" },
              }}
              render={({ field }) => (
                <Input {...field} className="rounded-3xl p-[10px] mb-2" placeholder="Nhập 12 chữ số" />
              )}
            />
            {errors.cccd && <p className="text-red-500">{errors.cccd.message}</p>}

            {/* Ngày sinh */}
            <label className="font-semibold text-sm block mt-4 mb-1">Ngày - Tháng - Năm sinh <span className="text-red-500">*</span></label>
            <div className="flex space-x-4">
              <Controller
                name="birthDay"
                control={control}
                rules={{ required: "Bắt buộc" }}
                render={({ field }) => (
                  <InputNumber {...field} min={1} max={31} placeholder="Ngày" className="rounded-3xl p-[3px]" />
                )}
              />
              <Controller
                name="birthMonth"
                control={control}
                rules={{ required: "Bắt buộc" }}
                render={({ field }) => (
                  <InputNumber {...field} min={1} max={12} placeholder="Tháng" className="rounded-3xl p-[3px]" />
                )}
              />
              <Controller
                name="birthYear"
                control={control}
                rules={{ required: "Bắt buộc" }}
                render={({ field }) => (
                  <InputNumber {...field} min={1900} max={2026} placeholder="Năm" className="rounded-3xl p-[3px]" />
                )}
              />
            </div>

            {/* Địa chỉ thường trú */}
            <label className="font-semibold text-sm block mt-6 mb-1">Địa chỉ thường trú <span className="text-red-500">*</span></label>
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Vui lòng nhập địa chỉ",
              }}
              render={({ field }) => (
                <Input {...field} className="rounded-3xl p-[10px] mb-2" placeholder="Nhập địa chỉ đầy đủ" />
              )}
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}

            {/* Ảnh CCCD */}
            <label className="font-semibold text-sm block mt-6 mb-1">Tải ảnh CCCD <span className="text-red-500">*</span></label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={beforeUpload}
            >
              {fileList.length >= 2 ? null : uploadButton}
            </Upload>
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />

          </div>
          <div className="bg-[#fffced] rounded-[20px] p-6 mt-5">
        <h2 className="text-lg font-medium mb-4">Thông tin liên lạc</h2>
        <label className="font-semibold text-sm block mt-4 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <Controller
              name="phone_number"
              control={control}
              rules={{
                required: "Vui lòng nhập số CCCD",
                pattern: { value: /^\d{10}$/, message: "Phải đủ 10 chữ số" },
              }}
              render={({ field }) => (
                <Input {...field} className="rounded-3xl p-[10px] mb-2" placeholder="Nhập 12 chữ số" />
              )}
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
            <label className="font-semibold text-sm block mt-4 mb-1">Email<span className="text-red-500">*</span></label>
            <Input value="selectedDetail" readOnly placeholder="Họ và tên"
            className="rounded-3xl p-[10px] mb-2"
             />

        </div>
        <div className="bg-[#fffced] rounded-[20px] p-6 mt-5 text-sm">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">🔒 Chính sách & Quy trình đặt cọc</h2>

  <ul className="list-disc list-inside space-y-2 text-gray-700">
    <li>
      <span className="font-medium">1. Số tiền đặt cọc:</span> 10% giá thuê tháng đầu.
    </li>
    <li>
      <span className="font-medium">2. Thời gian giữ cọc:</span> Hệ thống sẽ giữ cọc trong vòng <span className="text-blue-600 font-semibold">3 ngày</span> kể từ thời điểm đặt cọc.
    </li>
    <li>
      <span className="font-medium">3. Chủ trọ xác nhận:</span> Nếu chủ trọ đồng ý trong thời gian giữ cọc, hợp đồng chính thức sẽ được tạo và phòng sẽ bị ẩn khỏi danh sách.
    </li>
    <li>
      <span className="font-medium">4. Trường hợp chủ trọ không phản hồi:</span> Tiền đặt cọc sẽ được <span className="text-blue-600 font-semibold">hoàn trả 100%</span> về tài khoản người đặt cọc.
    </li>
    <li>
      <span className="font-medium">5. Trường hợp người thuê không ký hợp đồng đúng hạn:</span> Hệ thống có quyền <span className="text-red-600 font-semibold">không hoàn cọc</span>.
    </li>
  </ul>

  <p className="mt-4 italic text-gray-600">
    🔔 Mọi thắc mắc xin liên hệ bộ phận hỗ trợ khách hàng qua số điện thoại <span className="font-medium text-gray-800">1900-xxx-xxx</span> hoặc email <span className="font-medium text-gray-800">support@nhatro.vn</span>.
  </p>

  <div className="mt-5 flex items-start gap-2">
    <input type="checkbox" id="policy-agree" className="mt-1" />
    <label htmlFor="policy-agree" className="text-gray-700">
      Tôi đã đọc và đồng ý với các <span className="underline font-medium">điều khoản & chính sách đặt cọc</span>.
    </label>
  </div>
 
</div>
<div className="mt-5 flex justify-end">
    <Button htmlType="submit" className="bg-[#4caf4f] text-white rounded-3xl px-7 py-5 font-semibold">
      Thanh toán 
    </Button>
   </div> 
        </div>
        <div className="w-1/3">
        <div className="bg-[#fffced] rounded-[20px] p-4">
       <h2 className="text-lg font-medium">Thông tin phòng</h2>
        <CarouselComponent images={images} width="100%" height="25vh" className="rounded-[20px] mt-4" />
        <div className="mt-4">
          <h3 className="text-base font-medium">
  {selectedDetail?.roomInfo?.name || "Không có thông tin phòng"}
</h3>

          <p className="text-sm text-gray-500">Phòng ngủ riêng</p>
          <h3 className="text-base font-medium mt-2">Địa chỉ</h3>
            <p className="text-sm text-gray-500">123 Đường ABC, Quận 1, TP.HCM</p>
            <h3 className="text-base font-medium mt-2">Giá phòng</h3>
        </div>  
       </div>
       <div className="bg-[#e8f5e9] rounded-[20px] p-4 mt-5">
       <h2 className="text-lg font-medium">Thông tin cọc</h2>
       <p className="text-sm text-gray-500">Số tiền cần đặt cọc (10% của tháng thuê đầu tiên)</p>
       <Input value="300.000 đ" readOnly placeholder="Họ và tên"
            className="rounded-3xl p-[10px] mb-2"
             />
       <p className="text-sm text-gray-500"> Ngày đặt cọc</p>
         <Input value="21/02/2003" readOnly placeholder="Họ và tên"
                className="rounded-3xl p-[10px] mb-2"
        />
        <p className="text-sm text-gray-500"> Phương thức thanh toán</p>
        <div className="p-3 text-slate-400">
              <Radio.Group
                style={style}
                onChange={onChange}
                value={valuepayment}
                options={[
                  {
                    value: 1,
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#59595A",
                          fontWeight: 500,
                        }}
                      >
                        <img
                          src={vnpayLogo}
                          style={{
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            borderRadius: "10%",
                          }}
                        />
                        Mobile App Banking (VNPay)
                      </div>
                    ),
                  },
                  {
                    value: 2,
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#59595A",
                          fontWeight: 500,
                        }}
                      >
                        <img
                          src={momo}
                          style={{
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            borderRadius: "10%",
                          }}
                        />
                        Momo
                      </div>
                    ),
                  }
                ]}
              />
            </div>
       </div>
        </div>
      </form> 
    </div>
  );
};

export default Deposit;
