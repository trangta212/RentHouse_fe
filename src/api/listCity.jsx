export const getCityList = async () => {
    try {
      const response = await fetch(
        "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1"
      );

      const data = await response.json();
  
      if (data && data.data && Array.isArray(data.data.data)) {
        return data.data.data.map((province) => ({
          value: province.code, // Mã tỉnh/thành phố
          label: province.name, // Tên hiển thị
          code: province.code,
        }));
      }

      return [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
      return [];
    }
    
  };

  // src/api/locationApi.js

export const getWardList = async (cityId) => {
  try {
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${cityId}&limit=-1`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.data.map((ward) => ({
      name: ward.name,
      id: ward.code,
    }));
  } catch (error) {
    console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
    return null;
  }
};
export const getTownList = async (districtCode) => {
    try {
      const response = await fetch(
        `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`,
        { method: "GET" }
      );
  
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Kiểm tra dữ liệu trả về có hợp lệ không
      if (!data || !data.data || !Array.isArray(data.data.data)) {
        throw new Error("Dữ liệu API không hợp lệ");
      }
  
      return data.data.data.map((town) => ({
        name: town.name,
        id: town.code,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
      return []; // Trả về mảng rỗng thay vì `null`
    }
  }
  