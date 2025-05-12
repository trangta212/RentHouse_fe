import React from "react";
import ProgressComponent from "../../../components/progress/progress";
import "./index.css";
import { Input } from "antd";
import "../../../components/drop-down/dropdown.jsx";
import DropDownComponent from "../../../components/drop-down/dropdown.jsx";
import { InputNumber } from "antd";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { faInfo, faImage, faBars } from "@fortawesome/free-solid-svg-icons";
import "../../../components/upload-img/upload.jsx";
import UploadImg from "../../../components/upload-img/upload.jsx";
import { Divider } from "antd";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "antd";
import { DatePicker, Space } from "antd";
import { FaArrowUp } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { MdInfoOutline } from "react-icons/md";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Radio } from "antd";
import vnpayLogo from "../../../assets/images/vn-pay.png";
import momo from "../../../assets/images/momo.png";
import zalo from "../../../assets/images/zalo.png";
import { Box } from "@mui/material";
import Select from "react-select";
import { generateContent, validateFormData } from "./create-ai";
import { message } from "antd";
import { Spin } from "antd";
import {Upload, Image} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import {
  getCityList,
  getWardList,
  getTownList,
} from "../../../api/listCity.jsx";
import { useEffect } from "react";
import GoogleMapComponent from "../../../components/google-maps/googleMap";
import paymentApi from "../../../api/paymentApi";
import {getUserInfo} from "../../../api/userApi.js";
import { PlusOutlined } from "@ant-design/icons";



const { RangePicker } = DatePicker;
const style = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const PushInformationPage = () => {
  // Lấy thông tin người dùng
  const [userInfo, setUserInfo] = useState(null);
   useEffect(() => {
          const fetchUserInfo = async () => {
            try {
              const dataInfor = await getUserInfo();
              setUserInfo(dataInfor.data);
              // console.log("Thông tin người dùng:", dataInfor.data);
          }catch (error) {
            console.error("Error fetching user info:", error);
          }}

          fetchUserInfo();
        }
          , []);


  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const itemsList = [
    { label: "Trọ", key: "tro" },
    { label: "Chung cư", key: "chungcu" },
    { label: "Chung cư mini", key: "chungcumini" },
    { label: "Nhà nguyên căn", key: "nhanguyencan" },
    { label: "Phòng trọ", key: "phongtro" },
  ];

  const interiorList = [
    { label: "Đầy đủ", key: "1" },
    { label: "Không", key: "0" },
  ];
  const instruct = [
    {
      key: "img",
      content: (
        <div className="bg-blue-500 text-white p-2 rounded">
          Nội dung tùy chỉnh
        </div>
      ),
    },
  ];

  const {
    register,
    trigger,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      room_images: [],
      dropdown: "",
      erea: "",
      price: "",
      fullAddress: "",
      email: "",
      phone: "",
      textInputTitle: "",
      textInputNaiyo: "",
      textField: "",
      address: "",
    },
  });

  

  console.log("Giá trị hiện tại của erea:", watch("erea")); // Kiểm tra giá trị khi nhập

  const [isOpen, setIsOpen] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [pricePerDay, setPricePerDay] = useState(0); // Giá tiền mỗi ngày
  const [selectedOption, setSelectedOption] = useState(""); // State lưu nội dung

  const handleSelect = (price, option,priority) => {
    if (selectedPrice === price) {
      // Nếu nhấn lại vào cùng một button -> Reset
      setSelectedOption("");
      setSelectedPrice(null);
      setPricePerDay(0);
      setValue("priority", ""); // Xóa giá trị trong form
    } else {
      // Nếu chọn button mới -> Cập nhật button mới & tổng tiền
      setSelectedPrice(price);
      setPricePerDay(price);
      setSelectedOption(option);
      setValue("priority", priority); // Gán priority vào values
    }
  };
  // Set thứ ngày tháng
  const [totalDays, setTotalDays] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);

      setStartDate(start); // Lưu vào state
      setEndDate(end);

      const daysDiff = end.diff(start, "day"); // Tính số ngày
      setTotalDays(daysDiff);
    } else {
      setStartDate(null);
      setEndDate(null);
      setTotalDays(0);
    }
  };
  const formatStartDate = dayjs(startDate).format("YYYY-MM-DD");
  const formatEndDate = dayjs(endDate).format("YYYY-MM-DD");
  console.log(formatStartDate);
  console.log(formatEndDate);

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

  const totalPrice = totalDays * pricePerDay + extraPrice; // Tổng tiền

  console.log(
    "Current Button Class:",
    totalPriceWithExtra === 3000 ? "bg-slate-400" : "bg-[#D6D6D6]"
  );

  const [valuepayment, setValuePayment] = useState(1);
  const onChange = (e) => {
    setValuePayment(e.target.value);
  };

  const [provinceList, setProvinceList] = useState([]);
  const [provinceIds, setProvinceIds] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [townList, setTownList] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [wardIds, setWardIds] = useState([]);
  const [fullAddress, setFullAddress] = useState(""); // Thêm state cho địa chỉ đầy đủ

  useEffect(() => {
    const fetchProvinces = async () => {
      const provinces = await getCityList(); // Gọi API danh sách tỉnh/thành phố
      setProvinceList(provinces);
      setProvinceIds(provinces.map((p) => p.code));
    };

    fetchProvinces();
  }, []);

  const handleFetchWards = async (cityId) => {
    if (!cityId) return;
    try {
      console.log("Fetching wards for city:", cityId);
      const wards = await getWardList(cityId);
      console.log("Received wards:", wards);
      if (Array.isArray(wards)) {
        setDistrictList(
          wards.map((ward) => ({
            label: ward.name,
            value: ward.id, // Sử dụng ward.id thay vì ward.code
          }))
        );
        setWardIds(wards.map((ward) => ward.id)); // Sử dụng ward.id thay vì ward.code
      } else {
        console.error("Wards data is not an array:", wards);
        setDistrictList([]);
        setWardIds([]);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      message.error("Không thể lấy danh sách quận/huyện");
      setDistrictList([]);
      setWardIds([]);
    }
  };

  // Hàm cập nhật địa chỉ đầy đủ
  const updateFullAddress = (newAddress = "") => {
    const addressParts = [];

    // Thêm địa chỉ đường nếu có
    if (newAddress) {
      addressParts.push(newAddress);
    }

    // Thêm phường/xã nếu có
    if (selectedTown?.label) {
      addressParts.push(selectedTown.label);
    }

    // Thêm quận/huyện nếu có
    if (selectedDistrict?.label) {
      addressParts.push(selectedDistrict.label);
    }

    // Thêm tỉnh/thành phố nếu có
    if (selectedProvince?.label) {
      addressParts.push(selectedProvince.label);
    }

    // Ghép các phần thành chuỗi, cách nhau bởi dấu phẩy
    const fullAddr = addressParts.join(", ");
    setFullAddress(fullAddr);
  };
  console.log("Full Address:", fullAddress);

  // Cập nhật các hàm xử lý thay đổi
  const handleProvinceChange = async (selected) => {
    setSelectedProvince(selected);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedTown(null);
    setTownList([]);

    if (selected?.value) {
      await handleFetchWards(selected.value);
    }
    updateFullAddress(watch("address")); // Cập nhật địa chỉ đầy đủ
  };

  const handleFetchTown = async (wardId) => {
    if (!wardId) return;
    try {
      console.log("Fetching towns for ward:", wardId);
      const towns = await getTownList(wardId);
      console.log("Received towns:", towns);
      if (Array.isArray(towns)) {
        setTownList(
          towns.map((town) => ({
            label: town.name,
            value: town.id,
          }))
        );
      } else {
        console.error("Towns data is not an array:", towns);
        setTownList([]);
      }
    } catch (error) {
      console.error("Error fetching towns:", error);
      message.error("Không thể lấy danh sách phường/xã");
      setTownList([]);
    }
  };

  const handleWardChange = async (selected) => {
    console.log("Ward selected:", selected);
    setSelectedDistrict(selected);
    setSelectedTown(null);

    if (selected?.value) {
      console.log("Fetching towns for ward ID:", selected.value);
      await handleFetchTown(selected.value);
    } else {
      setTownList([]);
    }
    updateFullAddress(watch("address")); // Cập nhật địa chỉ đầy đủ
  };


  const [selectedExtensions, setSelectedExtensions] = useState([]);

  const toggleExtension = (value) => {
    setSelectedExtensions((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
  
      setValue("extensions", updated); // Cập nhật vào react-hook-form
      return updated;
    });
  };
  // Xử lý hình ảnh 
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



  const steps = [
    <div key="step1">
      <h2 className="mb-6 font-semibold text-base">Bước 1: Thông tin về trọ</h2>
      <div className="h-auto rounded-[20px] bg-[#E8F5E9]  p-6">
        <h1 className="text-left text-lg font-semibold ">
          {" "}
          Thông tin chính
          <span className="text-red-500 ml-1">*</span>
        </h1>
        <span className="text-gray-600 mt-8 font-semibold block">
          Loại trọ bạn muốn cho thuê
          <span className="text-red-500 ml-1">*</span>
        </span>
        <div className="mt-1 border border-gray-300 rounded-3xl p-[10px] h-auto bg-white">
          <input
            type="hidden"
            {...register("type", { required: "Vui lòng chọn một mục" })}
            value={watch("type") || ""}
          />

          {/* Component Dropdown */}
          <DropDownComponent
            className=""
            items={itemsList}
            value={watch("type")}
            onChange={(value) =>
              setValue("type", value, { shouldValidate: true })
            }
            error={errors.type?.message}
          />
        </div>
        <span className="text-gray-600 mt-5 font-semibold block ">
          Diện tích
          <span className="text-red-500 ml-1">*</span>
        </span>
        {/* <div className ="mt-2 border border-gray-300 rounded-3xl p-[12px] h-auto bg-white"> */}
        <Input
          {...register("erea", {
            required: "Vui lòng nhập diện tích phòng",
            pattern: {
              value: /^[0-9]+(\.[0-9]+)?$/,
              message: "Diện tích phải là số thực dương",
            },
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
        <span className="text-gray-600 mt-5 font-semibold block">
          Mức giá
          <span className="text-red-500 ml-1">*</span>
        </span>
        <Input
          {...register("price", {
            required: "Vui lòng nhập diện tích phòng",
            pattern: {
              value: /^[0-9]+(\.[0-9]+)?$/,
              message: "Diện tích phải là số thực dương",
            },
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
        {errors.price && (
          <p className="text-slate-600">{errors.price.message}</p>
        )}
      </div>
      <div className="h-auto rounded-[20px] bg-[#E8F5E9]  p-6 mt-12">
        <h1 className="text-left text-lg font-semibold "> Địa chỉ</h1>
        <span className="text-gray-600 mt-8 font-semibold block">
          Tỉnh/Thành phố
        </span>

        <Select
          styles={{
            control: (base, state) => ({
              ...base,
              marginTop: "4px",
              border: `1px solid ${!selectedProvince ? "#ff4d4f" : "#d1d5db"}`,
              borderRadius: "24px",
              padding: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              "&:hover": {
                border: "1px solid #2563eb",
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0px",
            }),
            input: (base) => ({
              ...base,
              margin: "0px",
              padding: "0px",
            }),
            menu: (base) => ({
              ...base,
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#2563eb" : "white",
              color: state.isSelected ? "white" : "#333",
              "&:hover": { backgroundColor: "#3b82f6", color: "white" },
            }),
          }}
          options={provinceList}
          value={provinceList.find(
            (p) => p.value === watch("dropdownProvince")
          )}
          onChange={handleProvinceChange}
          placeholder="Chọn tỉnh/thành phố..."
          isSearchable
        />

        <span className="text-gray-600 mt-5 font-semibold block">
          Quận/Huyện
          <span className="text-red-500 ml-1">*</span>
        </span>

        <Select
          styles={{
            control: (base, state) => ({
              ...base,
              marginTop: "4px",
              border: `1px solid ${!selectedDistrict ? "#ff4d4f" : "#d1d5db"}`,
              borderRadius: "24px",
              padding: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              "&:hover": {
                border: "1px solid #2563eb",
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0px",
            }),
            input: (base) => ({
              ...base,
              margin: "0px",
              padding: "0px",
            }),
            menu: (base) => ({
              ...base,
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#2563eb" : "white",
              color: state.isSelected ? "white" : "#333",
              "&:hover": { backgroundColor: "#3b82f6", color: "white" },
            }),
          }}
          options={districtList}
          value={selectedDistrict}
          onChange={handleWardChange}
          placeholder="Chọn quận/huyện..."
          isSearchable
        />

        <span className="text-gray-600 mt-5 font-semibold block">
          Phường/Xã
          <span className="text-red-500 ml-1">*</span>
        </span>

        <Select
          styles={{
            control: (base, state) => ({
              ...base,
              marginTop: "4px",
              border: `1px solid ${!selectedTown ? "#ff4d4f" : "#d1d5db"}`,
              borderRadius: "24px",
              padding: "5px",
              fontSize: "16px",
              backgroundColor: "white",
              "&:hover": {
                border: "1px solid #2563eb",
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0px",
            }),
            input: (base) => ({
              ...base,
              margin: "0px",
              padding: "0px",
            }),
            menu: (base) => ({
              ...base,
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#2563eb" : "white",
              color: state.isSelected ? "white" : "#333",
              "&:hover": { backgroundColor: "#3b82f6", color: "white" },
            }),
          }}
          options={townList}
          value={selectedTown}
          onChange={(selected) => {
            setSelectedTown(selected);
            updateFullAddress(watch("address"));
          }}
          placeholder="Chọn phường/xã..."
          isSearchable
        />

        <span className="text-gray-600 mt-5 font-semibold block">
          Đường
          <span className="text-gray-400 text-[13px] font-[300]">
            {" "}
            (Không bắt buộc){" "}
          </span>
        </span>
        <Input
          {...register("address")}
          className="mt-1 rounded-3xl p-[10px] text-[16px]"
          onChange={(e) => {
            setValue("address", e.target.value);
            updateFullAddress(e.target.value);
          }}
          placeholder="Nhập tên đường, số nhà..."
        />
        <span className="text-gray-600 mt-5 font-semibold block">
          Địa chỉ hiển thị trên tin đăng
        </span>
        <Input
          className="mt-1 rounded-3xl p-[10px] text-[16px]"
          value={fullAddress}
          readOnly
        />
        <div className="mt-8 mb-8">
          <GoogleMapComponent address={fullAddress} />
        </div>
      </div>
      <div className="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
        <h1 className="text-left text-lg font-semibold "> Thông tin khác </h1>
        <span className="text-gray-600 mt-8 font-semibold block">Nội thất</span>
        <div className="mt-1 border border-gray-300 rounded-3xl p-[10px] h-auto bg-white">
           <input
            type="hidden"
            {...register("full_furnishing", { required: "Vui lòng chọn một mục" })}
            value={watch("full_furnishing") || ""}
          />

          {/* Component Dropdown */}
          <DropDownComponent
            className=""
            items={interiorList}
            value={watch("full_furnishing")}
            onChange={(value) =>
              setValue("full_furnishing", value, { shouldValidate: true })
            }
            error={errors.full_furnishing?.message}
          />
        </div>
        <div className="flex items-center justify-between mt-8">
  <span className="text-gray-600 font-semibold h-full flex items-center">
    Tiền điện <span className="ml-1 text-sm text-gray-500">(giá tiền điện trên 1 số điện)</span>
  </span>
  <Input
    type="number"
    min={1}
    max={50}
    step={1}
    {...register("electricity_bill", {
      required: "Vui lòng nhập giá tiền điện",
      min: {
        value: 1,
        message: "Giá trị tối thiểu là 1",
      },
      max: {
        value: 50,
        message: "Giá trị tối đa là 50",
      },
    })}
    value={watch("electricity_bill") || ""}   
    onChange={(e) => {
      setValue("electricity_bill", e.target.value, { shouldValidate: true }); // Kích hoạt validation khi cập nhật
      if (/^[0-9]+(\.[0-9]+)?$/.test(e.target.value)) {
        clearErrors("electricity_bill"); // Xóa lỗi nếu hợp lệ
      }
    }}   
    placeholder="Nhập giá tiền điện"
    className="ml-4 w-[200px] rounded-3xl p-[10px]"
  />
  </div>
  <div className="flex items-center justify-between mt-8">
  <span className="text-gray-600 font-semibold h-full flex items-center">
    Tiền nước <span className="ml-1 text-sm text-gray-500">(giá tiền nước trên 1 số)</span>
  </span>
  <Input
    type="number"
    min={1}
    max={100}
    step={1}
    {...register("water_bill", {
      required: "Vui lòng nhập giá tiền nước",
      min: {
        value: 1,
        message: "Giá trị tối thiểu là 1",
      },
      max: {
        value: 100,
        message: "Giá trị tối đa là 100",
      },
    })}
    value={watch("water_bill") || ""}   
    onChange={(e) => {
      setValue("water_bill", e.target.value, { shouldValidate: true }); // Kích hoạt validation khi cập nhật
      if (/^[0-9]+(\.[0-9]+)?$/.test(e.target.value)) {
        clearErrors("water_bill"); // Xóa lỗi nếu hợp lệ
      }
    }}   
    placeholder="Nhập giá tiền nước"
    className="ml-4 w-[200px] rounded-3xl p-[10px]"
  />
</div>
        <span className="text-gray-600 mt-8 font-semibold block">Tiện ích</span>
        <div className="flex items-center space-x-5 mt-4">
  {[
    { label: "Camera", icon: faCamera },
    { label: "Tủ lạnh", icon: faUserShield },
    { label: "Máy giặt", icon: faFire },
  ].map((item) => {
    const isSelected = selectedExtensions.includes(item.label); // Kiểm tra trạng thái

    return (
      <Button
        key={item.label}
        variant="outlined"
        onClick={() => toggleExtension(item.label)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-[20px] font-semibold transition-colors duration-200 ${
          isSelected
          ? "bg-white border-gray-300 text-black" // Màu khi chưa chọn
            : "bg-blue-500 border-blue-500 text-white" // Màu khi chọn
        }`}
        sx={{
          borderRadius: "20px",
        }}
      >
        <FontAwesomeIcon icon={item.icon} className="text-lg" />
        <span className="font-semibold">{item.label}</span>
      </Button>
    );
  })}
</div>

 <input type="hidden" {...register("extensions")} />
      </div>
      <div className="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
        <h1 className="text-left text-lg font-semibold ">
          {" "}
          Thông tin liên hệ
          <span className="text-red-500 ml-1">*</span>
        </h1>
        <span className="text-gray-600 mt-5 font-semibold block">
          Tên liên hệ
          <span className="text-red-500 ml-1">*</span>
          <span className="text-sm text-gray-500 ml-2">(Tên của bạn trong CCCD)</span>
        </span>
        <Input
          {...register("fullNameIndentify", {
            required: "Vui lòng nhập thông tin",
            pattern: {
              value: /^[A-Za-zÀ-ỹ\s]+$/,
              message: "Chỉ được nhập chữ cái",
            },
          })}
          className="mt-1 rounded-3xl p-[10px] border w-full"
          placeholder="Nhập chữ cái"
          value={watch("fullNameIndentify") || ""}
          onChange={(e) => {
            setValue("fullNameIndentify", e.target.value, { shouldValidate: true });
            if (/^[A-Za-zÀ-ỹ\s]+$/.test(e.target.value)) {
              clearErrors("fullNameIndentify"); // Xóa lỗi nếu nhập đúng
            }
          }}
        />

<span className="text-gray-600 mt-5 font-semibold block">
  Ngày - Tháng - Năm sinh
  <span className="text-red-500 ml-1">*</span>
</span>
<Input
  type="date"
  {...register("date_of_birth", {
    required: "Vui lòng chọn ngày sinh",
    // Bạn có thể thêm custom validate nếu cần kiểm tra tuổi, ví dụ trên 18
  })}
  className="mt-1 rounded-3xl p-[10px]"
  value={watch("date_of_birth") || ""}
  onChange={(e) => {
    setValue("date_of_birth", e.target.value, { shouldValidate: true });
    clearErrors("date_of_birth");
  }}
/>
<span className="text-gray-600 mt-5 font-semibold block">
  Số CMND/CCCD
  <span className="text-red-500 ml-1">*</span>
</span>
<Input
  type="text"
  {...register("identifyNumber", {
    required: "Vui lòng nhập số CMND/CCCD",
    pattern: {
      value: /^\d{12}$/,
      message: "Số CMND/CCCD phải đủ 12 chữ số",
    },
  })}
  className="mt-1 rounded-3xl p-[10px]"
  placeholder="Nhập số CMND/CCCD"
  value={watch("identifyNumber") || ""}
  onChange={(e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // chỉ cho phép số
    setValue("identifyNumber", numericValue, { shouldValidate: true });
    if (/^\d{12}$/.test(numericValue)) {
      clearErrors("identifyNumber");
    }
  }}
/>
<span className="text-gray-600 mt-5 font-semibold block">
  Địa chỉ thường trú
  <span className="text-red-500 ml-1">*</span>
</span>
<Input
  type="text"
  {...register("user_address", {
    required: "Vui lòng nhập địa chỉ",
    minLength: {
      value: 5,
      message: "Địa chỉ phải có ít nhất 5 ký tự",
    },
  })}
  className="mt-1 rounded-3xl p-[10px]"
  placeholder="Nhập địa chỉ"
  value={watch("user_address") || ""}
  onChange={(e) => {
    setValue("user_address", e.target.value, { shouldValidate: true });
    if (e.target.value.length >= 5) {
      clearErrors("user_address");
    }
  }}
/>
        {/* Hiển thị lỗi nếu không đúng chữ cái */}
        {errors.user_address && (
          <p className="text-slate-600 mt-1">{errors.user_address.message}</p>
        )}

        <span className="text-gray-600 mt-5  font-semibold block">
          Email
          <span className="text-red-500 ml-1">*</span>
        </span>
        {/* <Input  
        className ="mt-1 rounded-3xl p-[10px]"
        placeholder="Basic usage" /> */}
       <Input
        className="mt-1 rounded-3xl p-[10px] bg-gray-100 cursor-not-allowed"
        placeholder="Nhập email"
       value={userInfo?.email || watch("email") || ""}
       readOnly
       />

      
        <span className="text-gray-600 mt-5  font-semibold block">
          Số điện thoại
          <span className="text-red-500 ml-1">*</span>
        </span>
        <Input
          // className ="mt-1 rounded-3xl p-[10px]"
          // placeholder="Basic usage" />
          {...register("phone", {
            required: "Vui lòng nhập số điện thoại",
            pattern: {
              value: /^\d{10}$/,
              message: "Số điện thoại phải có đúng 10 chữ số",
            },
          })}
          className="mt-1 rounded-3xl p-[10px]"
          placeholder="Nhập số điện thoại"
          value={watch("phone") || ""}
          onChange={(e) => {
            setValue("phone", e.target.value.replace(/\D/g, ""), {
              shouldValidate: true,
            });
            if (/^\d{10}$/.test(e.target.value)) {
              clearErrors("phone"); // Xóa lỗi nếu nhập đúng định dạng
            }
          }}
        />

        {/* Hiển thị lỗi nếu số điện thoại không hợp lệ */}
        {errors.phone && (
          <p className="text-slate-600 mt-1">{errors.phone.message}</p>
        )}

      </div>
      <div className="h-auto  mt-12 rounded-[20px] bg-[#E8F5E9]  p-6">
        <h1 className="text-left text-lg font-semibold ">
          {" "}
          Tiêu đề và mô tả
          <span className="text-red-500 ml-1">*</span>
        </h1>
        <span className="text-gray-600 mt-5 font-semibold block">
          Tiêu đề
          <span className="text-red-500 ml-1">*</span>
        </span>
        <div className="relative">
          <Input
            {...register("textInputTitle", {
              required: "Vui lòng nhập nội dung",
              minLength: {
                value: 30,
                message: "Phải nhập ký tự trong khoảng 30 đến 100",
              },
              maxLength: {
                value: 100,
                message: "Phải nhập ký tự trong khoảng 30 đến 100",
              },
            })}
            className="mt-1 rounded-3xl p-[10px] border w-full pr-[120px]"
            placeholder="Nhập nội dung (30 - 100 ký tự)"
            value={watch("textInputTitle") || ""}
            onChange={(e) => {
              setValue("textInputTitle", e.target.value, {
                shouldValidate: true,
              });
              if (e.target.value.length >= 30 && e.target.value.length <= 100) {
                clearErrors("textInputTitle");
              }
            }}
          />
          <Button
            variant="contained"
            disabled={isGeneratingTitle}
            onClick={() => generateWithAI("title")}
            sx={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              minWidth: "auto",
              height: "32px",
              backgroundColor: "#4caf4f",
              color: "white",
              "&:hover": {
                backgroundColor: "#3d8b40",
              },
            }}
          >
            {isGeneratingTitle ? (
              <Spin size="small" />
            ) : (
              <>
                <RobotOutlined style={{ marginRight: "4px" }} />
                Tạo với AI
              </>
            )}
          </Button>
        </div>

        {errors.textInputTitle && (
          <p className="text-slate-600 mt-1">{errors.textInputTitle.message}</p>
        )}

        <span className="text-gray-600 mt-5 font-semibold block">
          Mô tả
          <span className="text-red-500 ml-1">*</span>
        </span>
        <div className="relative">
          <Input.TextArea
            {...register("textInputNaiyo", {
              required: "Vui lòng nhập nội dung",
              minLength: {
                value: 30,
                message: "Phải nhập ký tự trong khoảng 30 đến 3000",
              },
              maxLength: {
                value: 3000,
                message: "Phải nhập ký tự trong khoảng 30 đến 3000",
              },
            })}
            className="mt-1 rounded-3xl p-[10px] min-h-[128px] mb-6"
            placeholder="Nhập nội dung (30 - 3000 ký tự)"
            value={watch("textInputNaiyo") || ""}
            onChange={(e) => {
              setValue("textInputNaiyo", e.target.value, {
                shouldValidate: true,
              });
              if (
                e.target.value.length >= 30 &&
                e.target.value.length <= 3000
              ) {
                clearErrors("textInputNaiyo");
              }
            }}
          />
          <Button
            variant="contained"
            disabled={isGeneratingDesc}
            onClick={() => generateWithAI("description")}
            sx={{
              position: "absolute",
              right: "8px",
              top: "8px",
              minWidth: "auto",
              height: "32px",
              backgroundColor: "#4caf4f",
              color: "white",
              "&:hover": {
                backgroundColor: "#3d8b40",
              },
            }}
          >
            {isGeneratingDesc ? (
              <Spin size="small" />
            ) : (
              <>
                <RobotOutlined style={{ marginRight: "4px" }} />
                Tạo với AI
              </>
            )}
          </Button>
        </div>

        {errors.textInputNaiyo && (
          <p className="text-slate-600 mt-1">{errors.textInputNaiyo.message}</p>
        )}
      </div>
    </div>,

    // Màn thứ 2
    <div>
      <h2 className="mb-6 font-semibold text-base">
        Bước 2: Hình ảnh và video
      </h2>
      <div>
        <h1 className="text-left text-lg font-semibold "> Hình ảnh </h1>
        <div className="bg-[#c1c9d2] h-full flex items-center justify-start border rounded-[40px] px-4 py-3  space-x-4 mt-4">
          <FontAwesomeIcon
            icon={faInfo}
            className="text-red-600 text-lg mt-0 ml-3"
          />
          <span className="text-black text-lg mt-[5px]">
            Đăng tối thiểu 3 ảnh
          </span>
        </div>

        <div className="mt-20 flex items-center justify-center">
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
        <div
          className="flex items-center  space-x-5 justify-between cursor-pointer mt-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          {" "}
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faImage} className="text-lg ml-3" />
            <span className="text-lg">Hướng dẫn đăng ảnh</span>
          </div>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="text-lg"
          />
        </div>
        {isOpen && (
          <div className="mt-6 p-4 text-lg text-gray-700 bg-slate-300 border  rounded-[30px] ">
            <ul className="list-disc pl-5">
              <li>
                Đăng tối đa <b>24</b> ảnh với tất cả các loại tin
              </li>
              <li>Hãy dùng ảnh thật, không trùng, không chèn SĐT</li>
              <li>
                Mỗi ảnh kích thước tối thiểu <b>100x100 px</b>, tối đa{" "}
                <b>15 MB</b>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Divider className="border-gray-200 mt-10 mb-10" />{" "}
      {/* Đường kẻ ngăn cách */}
      <div>
        <div className="flex items-center space-x-1">
          <h1 className="text-left text-lg font-semibold "> Video </h1>
          <span className="text-sm scale-95 text-slate-400">
            (Không bắt buộc)
          </span>
        </div>
        <Input
          className="mt-1 rounded-3xl p-[10px] h-[70px]"
          placeholder="Basic usage"
        />
      </div>
    </div>,
    // Màn thứ 3
    <div>
      <h2 className="mb-6 font-semibold text-base">Bước 3: Hoàn thành</h2>
      <h1 className="text-left text-lg font-semibold mt-10">
        {" "}
        Chọn loại tin ưu tiên{" "}
      </h1>
      <div className="mt-10">
        <Row gutter={16} className="flex justify-center space-x-7">
          <Col className="gutter-row" span={6}>
            <button
              className={`h-72 p-6 border rounded-[20px] cursor-pointer transition ${
                selectedPrice === 10000 ? "bg-yellow-50" : "bg-slate-600"
              }`}
              onClick={() => handleSelect(10000, "Ưu tiên đặc biệt",1)}
            >
              <div className="ml-5">
                <div className="w-10 bg-[#4caf4f] rounded-full text-[35px] h-[10px]"></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] mt-1"></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] mt-1 mb-1"></div>
                <div className="w-10 bg-[#ff5500]  rounded-full text-[35px] h-[8px]"></div>
              </div>
              <h1 className="text-lg font-semibold mt-4 text-left">
                Ưu tiên đặc biệt
              </h1>
              <p className="font-medium text-slate-500 mt-1">
                Đăng tin ở vị trí nổi bật trên cùng
              </p>
              <h1 className="text-[#636364] font-semibold text-lg mt-3 text-left">
                10.000 đồng/ngày
              </h1>
            </button>
          </Col>
          <Col className="gutter-row" span={6}>
            <button
              className={`h-full p-6 border rounded-[20px] cursor-pointer transition ${
                selectedPrice === 5000 ?  "bg-[#579c51]": "bg-slate-600"
              }`}
              onClick={() => handleSelect(5000, "Ưu tiên",2)}
            >
              <div className="ml-5">
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] "></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] mt-1 mb-1"></div>
                <div className="w-10 bg-[#4caf4f] rounded-full text-[35px] h-[10px] mb-1"></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px]"></div>
              </div>
              <h1 className="text-lg font-semibold mt-4 text-left text-[#ffffff]">
                {" "}
                Ưu tiên
              </h1>
              <p className="font-medium text-[#ffffff] text-left mt-1">
                Tin sẽ được hiển thị ở vị trí sau các tin đặc biệt{" "}
              </p>
              <h1 className="text-[#ffffff] font-semibold text-lg mt-3 text-left">
                5.000 đồng/ngày
              </h1>
            </button>
          </Col>
          <Col className="gutter-row" span={6}>
            <button
              className={`h-full p-7 border rounded-[20px] cursor-pointer transition ${
                selectedPrice === 0 ? "bg-green-300" : "bg-[#3a3838]"
              }`}
              onClick={() => handleSelect(0, "Tin thường",3)}
            >
              <div className="ml-5">
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] "></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px] mt-1 mb-1"></div>
                <div className="w-10 bg-[#ff5500] rounded-full text-[35px] h-[8px]"></div>
                <div className="w-10 bg-[#4caf4f] rounded-full text-[35px] h-[10px] mt-1"></div>
              </div>
              <h1 className="text-lg font-semibold mt-4 text-left text-[#ffffff]">
                {" "}
                Bình thường
              </h1>
              <p className="font-medium text-[#ffffff] text-left mt-1">
                Bản tin sẽ được hiển thị dưới cùng của danh sách{" "}
              </p>
              <h1 className="text-[#ffffff] font-semibold text-lg mt-3 text-left">
                Miễn phí
              </h1>
            </button>
          </Col>
        </Row>
      </div>
      <h1 className="text-left text-lg font-semibold mt-8">
        {" "}
        Ngày bắt đầu - Ngày kết thúc
      </h1>
      <RangePicker
        className="mt-6 w-full h-12 border rounded-[20px] text-xl"
        onChange={handleDateChange}
      />
     
      {/* Đường kẻ ngăn cách */}
    </div>,
    // Màn thanh toán
    <div>
      <h1 className=" mt-4 text-xl font-semibold"> THANH TOÁN</h1>
      <div className="flex justify-between mt-4">
        <div className="w-2/3 mr-4">
          <div className="h-11 bg-[#FFFCED]  rounded-[10px]">
            <div className="flex items-center space-x-1 p-2 ml-6">
              <MdInfoOutline className="inline-block align-middle text-[#59595a]" />
              <span className="inline-block align-middle text-[#59595a]">
                Vui lòng kiểm tra thông tin, vui lòng cập nhập tại đây
              </span>
            </div>
          </div>
          <div className="p-4 rounded-[10px] mt-4">
            <List>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: "#c1f0c1",
                  borderRadius: "10px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="h8"
                      sx={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      Thông tin liên lạc
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "#59595a" }}
                        >
                          {watch("textField")}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "#59595a" }}
                        >
                          {watch("email")}
                        </Typography>
                      </Box>

                      {/* Hàng thứ hai: Số điện thoại */}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: "#59595a",
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {watch("phone")}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: "#c1f0c1",
                  marginTop: "30px",
                  borderRadius: "10px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="User Image"
                    src={
                      watch("images")?.[0]
                        ? watch("images")[0] // Sử dụng trực tiếp URL hoặc tên file
                        : "/static/images/avatar/default.jpg" // Ảnh mặc định nếu không có ảnh
                    }
                    variant="square"
                    sx={{
                      borderRadius: "10px",
                      marginRight: "20px",
                      height: "70px",
                      width: "70px",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={watch("textInputTitle")}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "#59595a",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // Giới hạn 2 dòng
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {watch("textInputNaiyo")}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </div>
          <div className=" p-4 rounded-[10px] mt-4 bg-[#c1f0c1] font-semibold ml-4 mr-4">
            <h1 className="p-2 font-semibold"> Phương thức thanh toán</h1>
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
                  },
                  {
                    value: 3,
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
                          src={zalo}
                          style={{
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            borderRadius: "10%",
                          }}
                        />
                        Zalopay
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="w-[40%] bg-[#f2e9e5] p-6 rounded-2xl relative shadow-lg ml-5">
          <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
          <div className="bg-white p-4 rounded-lg mt-6 mb-32">
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Mã tin</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                11458523
              </span>
            </div>
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Loại tin</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                {selectedOption}
              </span>
            </div>
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Đơn giá</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                {selectedPrice} đ/ngày
              </span>
            </div>
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Số ngày đăng</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                {totalDays}
              </span>
            </div>
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Thời gian bắt đầu</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                {startDate ? startDate.format("YYYY-MM-DD") : "Chưa chọn"}
              </span>
            </div>
            <div className="flex justify-between text-base mt-1 text-[15px]">
              <span>Thời gian kết thúc</span>
              <span className="font-semibold text-gray-800 text-[15px]">
                {endDate ? endDate.format("YYYY-MM-DD") : "Chưa chọn"}
              </span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-400 my-4"></div>
          <div className="flex justify-between mt-">
            <span className="text-lg">Tổng tiền</span>
            <span className="font-semibold text-gray-800">
              {totalPrice.toLocaleString()} đồng
            </span>
          </div>
        </div>
      </div>
    </div>,
  ];

  const generateWithAI = async (type) => {
    const isTitle = type === "title";
    const setLoading = isTitle ? setIsGeneratingTitle : setIsGeneratingDesc;
    try {
      setLoading(true);
      console.log("Starting AI generation for:", type);

      // Lấy dữ liệu từ form
      const formData = {
        propertyType: watch("dropdown") || "",
        area: watch("erea") || "",
        price: watch("price") || "",
        location: watch("dropdownProvince") || "",
        interior: watch("dropdownInterior") || "Cơ bản",
        utilities: [], // Có thể thêm sau
      };

      // Log chi tiết từng trường dữ liệu và kiểm tra tính hợp lệ
      console.log("Form data validation check:");
      console.log("Property Type:", {
        value: formData.propertyType,
        isValid: Boolean(formData.propertyType),
      });
      console.log("Area:", {
        value: formData.area,
        isNumber: !isNaN(Number(formData.area)),
        isValid: Boolean(formData.area) && !isNaN(Number(formData.area)),
      });
      console.log("Price:", {
        value: formData.price,
        isNumber: !isNaN(Number(formData.price)),
        isValid: Boolean(formData.price) && !isNaN(Number(formData.price)),
      });
      console.log("Location:", {
        value: formData.location,
        isValid: Boolean(formData.location),
      });
      console.log("Interior:", {
        value: formData.interior,
        isValid: Boolean(formData.interior),
      });

      // Validate dữ liệu
      validateFormData(formData);

      // Gọi hàm tạo nội dung
      const generatedContent = await generateContent(type, formData);
      console.log("Generated content:", generatedContent);

      if (!generatedContent || generatedContent.trim() === "") {
        throw new Error("OpenAI không trả về nội dung. Vui lòng thử lại!");
      }

      console.log(
        "Updating form field:",
        isTitle ? "textInputTitle" : "textInputNaiyo"
      );
      console.log("With content:", generatedContent);

      // Cập nhật form với nội dung được tạo
      setValue(
        isTitle ? "textInputTitle" : "textInputNaiyo",
        generatedContent,
        {
          shouldValidate: true,
        }
      );

      // Kiểm tra giá trị sau khi cập nhật
      console.log(
        "Updated value:",
        watch(isTitle ? "textInputTitle" : "textInputNaiyo")
      );

      // Hiển thị thông báo thành công
      message.success("Đã tạo nội dung thành công!");
    } catch (error) {
      console.error("Error in generateWithAI:", error);
      message.error(error.message || "Có lỗi xảy ra khi tạo nội dung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="push-paper-information">
      <h1 className="push-paper-information-title">Tạo tin đăng bài</h1>
      <ProgressComponent
        steps={steps}
        register={register}
        trigger={trigger}
        errors={errors}
        getValues={getValues}
        totalPrice={totalPrice.toLocaleString()}
        startDate={formatStartDate}
        endDate={formatEndDate}
        name={watch("textField")}
        fileList={fileList}
        fullAddress={fullAddress}
      />
      <div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default PushInformationPage;
