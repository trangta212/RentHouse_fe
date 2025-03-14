import React from "react"
import ProgressComponent from "../../../components/progress/progress"
import "./index.css"
import { Input } from 'antd';
import '../../../components/drop-down/dropdown.jsx'
import DropDownComponent from "../../../components/drop-down/dropdown.jsx";
import { InputNumber } from 'antd';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {faUserShield} from "@fortawesome/free-solid-svg-icons";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import {faInfo, faImage , faBars} from "@fortawesome/free-solid-svg-icons";
import '../../../components/upload-img/upload.jsx'
import UploadImg from "../../../components/upload-img/upload.jsx";
import { Divider } from 'antd';
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from 'antd';
import { DatePicker, Space } from 'antd';
import { FaArrowUp } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { MdInfoOutline } from "react-icons/md";




const { RangePicker } = DatePicker;



const PushInformationPage = () => {  

  const itemsList = [
    { label: 'Trọ', key: 'tro' },
    { label: 'Chung cư', key: 'chungcu' },
    { label: 'Chung cư mini', key: 'chungcumini' },
    { label: 'Nhà nguyên căn', key: 'nhanguyencan' },
    { label: 'Phòng trọ', key: 'phongtro' },
  ];  

  const interiorList =[
      {label:'Đầy đủ',key: 'full'},
      {label: 'Cơ bản',key: 'basic'},
      {label: 'Không',key: 'none'},
  ]
  const instruct = [
    { key: "img", content: 
    <div className="bg-blue-500 text-white p-2 rounded">
      Nội dung tùy chỉnh
      </div> },
  ];
  const {
    register,
    trigger,
    clearErrors,  
    watch, 
    setValue,
    getValues, 
    formState: { errors }
  } = useForm({
    mode: "onChange"
  });
  console.log("Giá trị hiện tại của erea:", watch("erea")); // Kiểm tra giá trị khi nhập

  const [isOpen, setIsOpen] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [pricePerDay, setPricePerDay] = useState(0); // Giá tiền mỗi ngày
  
  const handleSelect = (price) => {
    if (selectedPrice === price) {
      // Nếu nhấn lại vào cùng một button -> Reset
      setSelectedPrice(null);
      setPricePerDay(0);
    } else {
      // Nếu chọn button mới -> Cập nhật button mới & tổng tiền
      setSelectedPrice(price);
      setPricePerDay(price);
    }
  };
// Set thứ ngày tháng
  const [totalDays, setTotalDays] = useState(0);

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]);
      const endDate = dayjs(dates[1]);
      const daysDiff = endDate.diff(startDate, "day") ; // Thêm 1 để tính cả ngày đầu và ngày cuối
      setTotalDays(daysDiff);
    } else {
      setTotalDays(0);
    }
  };


  // Áp dụng thêm gói tin đi kèm
  const [totalPriceWithExtra, setTotalPriceWithExtra] = useState(null);
  const [extraPrice, setExtraPrice] = useState(0);

  const handleSelectExtra = (extra) => {
    if (totalPriceWithExtra === extra) {
      // Nếu nhấn lại vào cùng một button -> Reset
      setTotalPriceWithExtra(null);
      setExtraPrice(0);
    } else {
      // Nếu chọn button mới -> Cập nhật button mới & tổng tiền
      setTotalPriceWithExtra(extra);
      setExtraPrice(extra);
    }
  };
  console.log("totalPriceWithExtra:", totalPriceWithExtra);

  const totalPrice = totalDays * pricePerDay + extraPrice ; // Tổng tiền


  console.log(
    "Current Button Class:",
    totalPriceWithExtra === 3000 ? "bg-slate-400" : "bg-[#D6D6D6]"
  );
  



  const steps = [
    <div key="step1">
      <h2 className ="mb-6 font-semibold text-base">Bước 1: Thông tin về trọ</h2>
      <div className ="h-auto rounded-[20px] bg-[#E8F5E9]  p-6">
        <h1 className ="text-left text-lg font-semibold "> Thông tin chính
        <span className="text-red-500 ml-1">*</span>
        </h1>
        <span className ="text-gray-600 mt-8 font-semibold block">Loại trọ bạn muốn cho thuê
        <span className="text-red-500 ml-1">*</span>
        </span>
        <div className ="mt-1 border border-gray-300 rounded-3xl p-[10px] h-auto bg-white">
        <input 
        type="hidden"
        {...register("dropdown", { required: "Vui lòng chọn một mục" })}
        value={watch("dropdown") || ""}
      />

      {/* Component Dropdown */}
      <DropDownComponent
        className=""
        items={itemsList}
        value={watch("dropdown")}
        onChange={(value) => setValue("dropdown", value, { shouldValidate: true })} 
        error={errors.dropdown?.message}
      />
       </div>
       <span className ="text-gray-600 mt-5 font-semibold block ">Diện tích
       <span className="text-red-500 ml-1">*</span>
       </span>
        {/* <div className ="mt-2 border border-gray-300 rounded-3xl p-[12px] h-auto bg-white"> */}
        <Input
        {...register("erea", { 
          required: "Vui lòng nhập diện tích phòng",
          pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Diện tích phải là số thực dương" }
        })}
        className="mt-1 rounded-3xl p-[10px]"
        placeholder="Nhập diện tích phòng"
        type="text"
        value={watch("erea")}
        onChange={(e) => {
          setValue("erea", e.target.value, { shouldValidate: true }); // Kích hoạt validation khi cập nhật
          if (/^[0-9]+(\.[0-9]+)?$/.test(e.target.value)) {
            clearErrors("erea"); // Xóa lỗi nếu hợp lệ
          }
        }}
      />
      {errors.erea && <p className="text-slate-600">{errors.erea.message}</p>}
{/* Hiển thị lỗi nếu có */}



       {/* </div> */}
       <span className ="text-gray-600 mt-5 font-semibold block">Mức giá
       <span className="text-red-500 ml-1">*</span>
       </span>
       <Input
        {...register("price", { 
          required: "Vui lòng nhập diện tích phòng",
          pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Diện tích phải là số thực dương" }
        })}
        className="mt-1 rounded-3xl p-[10px]"
        placeholder="Nhập giá phòng mỗi tháng"
        type="text"
        value={watch("price")}
        onChange={(e) => {
          setValue("price", e.target.value, { shouldValidate: true }); // Kích hoạt validation khi cập nhật
          if (/^[0-9]+(\.[0-9]+)?$/.test(e.target.value)) {
            clearErrors("price"); // Xóa lỗi nếu hợp lệ
          }
        }}
      />
      {errors.price && <p className="text-slate-600">{errors.price.message}</p>}
      </div> 
      <div className ="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
       <h1 className ="text-left text-lg font-semibold "> Thông tin khác </h1>
       <span className ="text-gray-600 mt-8 font-semibold block">Nội thất</span>
        <div className ="mt-1 border border-gray-300 rounded-3xl p-[10px] h-auto bg-white">
        {/* <DropDownComponent 
        className="" 
       items={interiorList} 
      placeholder="Chọn nội thất" 
       value={selectedValue} 
      onChange={(value) => setSelectedValue(value)} 
      /> */}
        <DropDownComponent
        className=""
        items={interiorList}
        value={watch("dropdownInterior")}
        onChange={(value) => setValue("dropdownInterior", value)} 
        error={errors.dropdown?.message}
      />

        </div>
        <div className=" flex items-center justify-between mt-8">
        <span className="text-gray-600 font-semibold h-full flex items-center">Số phòng ngủ</span>
        <InputNumber min={1} max={10} defaultValue={3}/>
        </div>
        <div className=" flex items-center justify-between mt-8">
        <span className="text-gray-600 font-semibold h-full flex items-center">Số phòng tắm, vệ sinh</span>
        <InputNumber min={1} max={10} defaultValue={3}/>
        </div>
        <span className ="text-gray-600 mt-8 font-semibold block">Tiện ích</span>
        <div className="flex items-center space-x-5 mt-4">
        <Button variant="outlined" className="flex items-center space-x-2"
          sx={{
            borderRadius: "20px", // Tuỳ chỉnh bo góc
            backgroundColor: "white", // Đặt màu nền trắng
            borderColor: "#ccc", // Đặt màu viền
           }}
        >
         <FontAwesomeIcon icon={faCamera} className="text-black text-lg" />
         <span className="text-black font-semibold">Camera</span>
        </Button>
        <Button variant="outlined" className="flex items-center space-x-2"
          sx={{
            borderRadius: "20px", // Tuỳ chỉnh bo góc
            backgroundColor: "white", // Đặt màu nền trắng
            borderColor: "#ccc", // Đặt màu viền
           }}
        >
        <FontAwesomeIcon icon={faUserShield} className="text-black text-lg" />
        <span className="text-black font-semibold">Bảo vệ</span>
        </Button>
        <Button variant="outlined" className="flex items-center space-x-2"
          sx={{
            borderRadius: "20px", // Tuỳ chỉnh bo góc
            backgroundColor: "white", // Đặt màu nền trắng
            borderColor: "#ccc", // Đặt màu viền
           }}
        >
        <FontAwesomeIcon icon={faFire} className="text-black text-lg" />
       <span className="text-black font-semibold">PCCC</span>
        </Button>
        </div>
      </div>
      <div className ="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
       <h1 className ="text-left text-lg font-semibold "> Thông tin liên hệ 
       <span className="text-red-500 ml-1">*</span>
       </h1>
       <span className ="text-gray-600 mt-5 font-semibold block">Tên liên hệ
       <span className="text-red-500 ml-1">*</span>
       </span>
        <Input  
         {...register("textField", { 
          required: "Vui lòng nhập thông tin", 
          pattern: { value: /^[A-Za-zÀ-ỹ\s]+$/, message: "Chỉ được nhập chữ cái" }
        })}  
        className="mt-1 rounded-3xl p-[10px] border w-full"
        placeholder="Nhập chữ cái"
        value={watch("textField") || ""}
        onChange={(e) => {
          setValue("textField", e.target.value, { shouldValidate: true });
          if (/^[A-Za-zÀ-ỹ\s]+$/.test(e.target.value)) {
            clearErrors("textField"); // Xóa lỗi nếu nhập đúng
          }
        }}
      />
      
      {/* Hiển thị lỗi nếu không đúng chữ cái */}
      {errors.textField && <p className="text-slate-600 mt-1">{errors.textField.message}</p>}

        <span className ="text-gray-600 mt-5  font-semibold block">Email
        <span className="text-red-500 ml-1">*</span>
        </span>
        {/* <Input  
        className ="mt-1 rounded-3xl p-[10px]"
        placeholder="Basic usage" /> */}
        <Input 
          {...register("email", { 
          required: "Vui lòng nhập email", 
          pattern: { 
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 
            message: "Phải nhập đúng định dạng của email" 
          }
        })}  
        className ="mt-1 rounded-3xl p-[10px]"
        placeholder="Nhập email"
        value={watch("email") || ""}
        onChange={(e) => {
          setValue("email", e.target.value, { shouldValidate: true });
          if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)) {
            clearErrors("email"); // Xóa lỗi nếu nhập đúng định dạng
          }
        }}
      />
      {errors.email && <p className="text-slate-600 mt-1">{errors.email.message}</p>}
        <span className ="text-gray-600 mt-5  font-semibold block">Số điện thoại
        <span className="text-red-500 ml-1">*</span>
        </span>
        <Input  
        // className ="mt-1 rounded-3xl p-[10px]"
        // placeholder="Basic usage" />
        {...register("phone", { 
          required: "Vui lòng nhập số điện thoại", 
          pattern: { 
            value: /^\d{10}$/, 
            message: "Số điện thoại phải có đúng 10 chữ số" 
          }
        })}  
        className ="mt-1 rounded-3xl p-[10px]"
        placeholder="Nhập số điện thoại"
        value={watch("phone") || ""}
        onChange={(e) => {
          setValue("phone", e.target.value.replace(/\D/g, ""), { shouldValidate: true });
          if (/^\d{10}$/.test(e.target.value)) {
            clearErrors("phone"); // Xóa lỗi nếu nhập đúng định dạng
          }
        }}
      />
      
      {/* Hiển thị lỗi nếu số điện thoại không hợp lệ */}
      {errors.phone && <p className="text-slate-600 mt-1">{errors.phone.message}</p>}


      </div>
      <div className ="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
      <h1 className ="text-left text-lg font-semibold "> Tiêu đề và mô tả
      <span className="text-red-500 ml-1">*</span>
      </h1>
      <span className ="text-gray-600 mt-5 font-semibold block">Tiêu đề
      <span className="text-red-500 ml-1">*</span>
      </span>
      <Input  
  {...register("textInputTitle", { 
    required: "Vui lòng nhập nội dung", 
    minLength: { value: 30, message: "Phải nhập ký tự trong khoảng 30 đến 100" }, 
    maxLength: { value: 100, message: "Phải nhập ký tự trong khoảng 30 đến 100" } 
  })}  
  className="mt-1 rounded-3xl p-[10px] border w-full"
  placeholder="Nhập nội dung (30 - 100 ký tự)"
  value={watch("textInputTitle") || ""}
  onChange={(e) => {
    setValue("textInputTitle", e.target.value, { shouldValidate: true });
    if (e.target.value.length >= 30 && e.target.value.length <= 100) {
      clearErrors("textInputTitle"); // Xóa lỗi nếu hợp lệ
    }
  }}
/>

{/* Hiển thị lỗi nếu không hợp lệ */}
{errors.textInputTitle && (
  <p className="text-slate-600 mt-1">{errors.textInputTitle.message}</p>
)}

       <span className ="text-gray-600 mt-5 font-semibold block">Mô tả
      <span className="text-red-500 ml-1">*</span>
      </span> 
      {/* <Input  
        className ="mt-1 rounded-3xl p-[10px] h-32"
        placeholder="Basic usage" /> */}
 <Input  
  {...register("textInputNaiyo", { 
    required: "Vui lòng nhập nội dung", 
    minLength: { value: 30, message: "Phải nhập ký tự trong khoảng 30 đến 3000" }, 
    maxLength: { value: 3000, message: "Phải nhập ký tự trong khoảng 30 đến 3000" } 
  })}  
  className ="mt-1 rounded-3xl p-[10px] h-32 mb-6"
  placeholder="Nhập nội dung (30 - 3000 ký tự)"
  value={watch("textInputNaiyo") || ""}
  onChange={(e) => {
    setValue("textInputNaiyo", e.target.value, { shouldValidate: true });

    // Xóa lỗi nếu hợp lệ
    if (e.target.value.length >= 30 && e.target.value.length <= 3000) {
      clearErrors("textInputNaiyo");
    }
  }}
/>

{/* Hiển thị lỗi nếu không hợp lệ */}
{errors.textInputNaiyo && (
  <p className="text-slate-600 mt-1">{errors.textInputNaiyo.message}</p>
)}
      </div>
    </div>,

// Màn thứ 2
    <div>
      <h2 className ="mb-6 font-semibold text-base">Bước 2: Hình ảnh và video</h2>
      <div>
      <h1 className ="text-left text-lg font-semibold "> Hình ảnh </h1> 
      <div className="bg-[#c1c9d2] h-full flex items-center justify-start border rounded-[40px] px-4 py-3  space-x-4 mt-4">
         <FontAwesomeIcon icon={faInfo} className="text-red-600 text-lg mt-0 ml-3" />
         <span className="text-black text-lg mt-[5px]">Đăng tối thiểu 3 ảnh</span>
      </div>
      <div className="mt-20 flex items-center justify-center">
        <UploadImg />
      </div>
      <div 
                className="flex items-center  space-x-5 justify-between cursor-pointer mt-8" 
                onClick={() => setIsOpen(!isOpen)}>    <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faImage} className="text-lg ml-3" />
                <span className="text-lg">Hướng dẫn đăng ảnh</span>
                </div>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-lg" />
            </div>
            {isOpen && (
                <div className="mt-6 p-4 text-lg text-gray-700 bg-slate-300 border  rounded-[30px] ">
                    <ul className="list-disc pl-5">
                        <li>Đăng tối đa <b>24</b> ảnh với tất cả các loại tin</li>
                        <li>Hãy dùng ảnh thật, không trùng, không chèn SĐT</li>
                        <li>Mỗi ảnh kích thước tối thiểu <b>100x100 px</b>, tối đa <b>15 MB</b></li>
                    </ul>
                </div>
            )}
      </div>
      <Divider className="border-gray-200 mt-10 mb-10" /> {/* Đường kẻ ngăn cách */}
      <div>
      <div className="flex items-center space-x-1">
      <h1 className ="text-left text-lg font-semibold "> Video </h1>
      <span className="text-sm scale-95 text-slate-400">(Không bắt buộc)</span>
      </div>
      <Input  
        className ="mt-1 rounded-3xl p-[10px] h-[70px]"
        placeholder="Basic usage" />
      </div>
    </div>,
  // Màn thứ 3
    <div>
      <h2 className ="mb-6 font-semibold text-base">Bước 3: Hoàn thành</h2>
      <h1 className ="text-left text-lg font-semibold "> Chọn loại tin ưu tiên </h1>
      <div className="mt-4">
      <Row gutter={16} className="flex justify-center space-x-7">
      <Col className="gutter-row" span={6}>
  <button 
    className={`h-full p-6 border rounded-[20px] cursor-pointer transition ${
      selectedPrice === 20000 ? "bg-green-300" : "bg-[#D6D6D6]"
    }`}
    onClick={() => handleSelect(20000)}
  >
    <div className="flex flex-col items-center border rounded-[30px] p-4 bg-white">
      <div className="w-8 bg-red-600 rounded-full text-[35px] h-2"></div>
      <div className="w-8 bg-black rounded-full text-[35px] h-[6px] mt-1"></div>
      <div className="w-8 bg-black rounded-full text-[35px] h-[6px] mt-1 mb-1"></div>
      <div className="w-8 bg-black rounded-full text-[35px] h-[6px]"></div>
    </div>
    <h1 className="text-lg font-semibold mt-5">Ưu tiên đặc biệt</h1>
    <p className="font-medium mt-3">Đăng tin ở vị trí nổi bật trên cùng</p>
    <h1 className="text-red-600 font-bold text-lg mt-5">20000 đồng/ngày</h1>
  </button>
</Col>
      <Col className="gutter-row" span={6}>
      <button 
       className={`h-full p-6 border rounded-[20px] cursor-pointer transition ${
        selectedPrice === 10000 ? "bg-green-300" : "bg-[#D6D6D6]"
      }`}
      onClick={() => handleSelect(10000)}
      >
        <div className="flex flex-col items-center border rounded-[30px] p-4 bg-white">
           <div className="w-8 bg-black rounded-full text-[35px] h-[6px] "></div>
           <div className="w-8 bg-black rounded-full text-[35px] h-[6px] mt-1"></div>
           <div className="w-8 bg-red-600 rounded-full text-[35px] h-2 mt-1 mb-1"></div>
           <div className="w-8 bg-black rounded-full text-[35px] h-[6px]"></div>
        </div>
          <h1 className="text-lg font-semibold mt-5"> Ưu tiên</h1>
          <p className="font-medium mt-3">Tin sẽ được hiển thị ở vị trí sau các tin đặc biệt  </p>
          <h1 className="text-red-600 font-bold text-lg mt-5"> 10000 đồng/ngày</h1>
        </button>
      </Col>
      <Col className="gutter-row" span={6}>
      <button 
        className={`h-full p-6 border rounded-[20px] cursor-pointer transition ${
          selectedPrice === 3000 ? "bg-green-300" : "bg-[#D6D6D6]"
        }`}
        onClick={() => handleSelect(3000)}
      >
        <div className="flex flex-col items-center border rounded-[30px] p-4 bg-white">
           <div className="w-8 bg-black rounded-full text-[35px] h-[6px] "></div>
           <div className="w-8 bg-black rounded-full text-[35px] h-[6px] mt-1"></div>
           <div className="w-8  bg-black rounded-full text-[35px] h-[6px] mt-1 mb-1"></div>
           <div className="w-8 bg-red-600 rounded-full text-[35px] h-2"></div>
        </div>
          <h1 className="text-lg font-semibold mt-5"> Bình thường</h1>
          <p className="font-medium mt-3">Bản tin sẽ được hiển thị dưới cùng của danh sách  </p>
          <h1 className="text-red-600 font-bold text-lg mt-5"> 3000 đồng/ngày</h1>
        </button>
      </Col>
    </Row>
      </div>
      <h1 className ="text-left text-lg font-semibold mt-8"> Ngày bắt đầu - Ngày kết thúc</h1>
      <RangePicker
       className="mt-6 w-full h-12 border rounded-[20px] text-xl" 
       onChange={handleDateChange}
       />
      <h1 className ="text-left text-lg font-semibold mt-8"> Gói mua tin nổi bật đi kèm</h1>
      <p className="font-medium mt-3">Tin sẽ được đẩy lên đầu mỗi ngày</p>
      <div className="flex items-center space-x-5 mt-4 ">
      <div className="w-1/2 flex justify-center h-16">
      <Button
  variant="outlined"
  sx={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    transition: "all 0.3s ease-in-out",
    borderRadius: "10px",
    borderColor: "#ccc",
    backgroundColor: totalPriceWithExtra === 6000 ? "#D6D6D6" : "#FFFFFF", // bg-black hoặc bg-[#D6D6D6]
  }}
  onClick={() => handleSelectExtra(6000)}
>
  <FaArrowUp className="text-black text-lg" />
  <span className="text-black font-semibold text-lg p-2" >1 lần đẩy</span>
  <span className="text-red-500 ml-auto text-lg ">10000 đồng</span>
  </Button> 
     </div>
        <div className="w-1/2 flex justify-center h-16">
      <Button
  variant="outlined"
  sx={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    transition: "all 0.3s ease-in-out",
    borderRadius: "10px",
    borderColor: "#ccc",
    backgroundColor: totalPriceWithExtra === 3000 ? "#D6D6D6" : "#FFFFFF", // bg-black hoặc bg-[#D6D6D6]
  }}
  onClick={() => handleSelectExtra(3000)}
>
  <FaArrowUp className="text-black text-lg" />
  <span className="text-black font-semibold text-lg p-2" >3 lần đẩy</span>
  <span className="text-red-500 ml-auto text-lg ">40000 đồng</span>
  </Button> 
  </div>
      </div>
      <Divider className="border-gray-200 mt-10 mb-4" /> {/* Đường kẻ ngăn cách */}
      <div className="flex items-center  mt-4">
        <div className="flex items-center space-x-4">
          <MdDiscount />
          <h1 className ="text-base "> Khuyến mãi</h1>
        </div>
        <div className="flex ml-auto justify-end">
        <Button className="p-0" >
          <span className="text-slate-400"> Chọn khuyến mãi</span>
        </Button>
        </div>
      </div>
      <Divider className="border-gray-200 mt-4 mb-4" /> {/* Đường kẻ ngăn cách */}
    </div>,
    // Màn thanh toán 
    <div>
      <h1 className =" mt-4 text-xl font-semibold"> THANH TOÁN</h1>
      <div className ="flex justify-between mt-4">
        <div className ="w-2/3">
          <div className="h-11 bg-[#FFFCED]  rounded-[10px]">
          <div className="flex items-center space-x-1 p-2 ml-6">
         <MdInfoOutline className="inline-block align-middle text-[#59595a]" />
         <span className="inline-block align-middle text-[#59595a]">Vui lòng kiểm tra thông tin, vui lòng cập nhập tại đây</span>
         </div>
          </div>
        </div>
        <div className="w-1/3 bg-blue-50 p-6 rounded-2xl relative shadow-lg ml-5">
          <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
        <div className="bg-blue-100 p-4 rounded-lg mt-4 mb-32">
          <div className="flex justify-between text-base mt-1">
          <span >Loại tin</span>
          <span className="font-semibold text-gray-800">11458523</span>
          </div>
          <div className="flex justify-between text-base mt-1">
          <span>Thanh toán</span>
          <span className="font-semibold text-gray-800">11458523</span>
          </div>
          <div className="flex justify-between text-base mt-1">
          <span>Đơn giá</span>
          <span className="font-semibold text-gray-800">5000 ngày</span>
          </div>
          <div className="flex justify-between text-base mt-1">
          <span>Số ngày đăng</span>
          <span className="font-semibold text-gray-800">5000 ngày</span>
          </div>
          <div className="flex justify-between text-base mt-1">
          <span>Thời gian bắt đầu</span>
          <span className="font-semibold text-gray-800">5000 ngày</span>
          </div>
          <div className="flex justify-between text-base mt-1">
          <span>Thời gian kết thúc</span>
          <span className="font-semibold text-gray-800">5000 ngày</span>
          </div>
        </div>
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <div className="flex justify-between">
          <span className="text-lg">Tổng tiền</span>
          <span className="font-semibold text-gray-800">{totalPrice.toLocaleString()} đồng</span>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div className ="push-paper-information">
      <h1 className ="push-paper-information-title">Tạo tin đăng bài</h1>
      <ProgressComponent 
      steps={steps} 
      register={register} 
      trigger={trigger} 
      errors={errors} 
      getValues={getValues} 
      totalPrice={totalPrice.toLocaleString()}
    />
    <div>
    <ToastContainer />
    </div>
    </div>
  );
};

export default PushInformationPage;

