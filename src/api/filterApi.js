import axiosInstance from "../untils/axiosInstance.js";

export const fetchFilteredRooms = async ({ location, propertyType, priceRange, area, keyword }) => {
  try {
    // Tạo URL dựa trên các giá trị lọc
    const url = `/user/home/${location || 'all'}/${propertyType || 'all'}/${priceRange || 'all'}/${area || 'all'}`;

    // Gửi request kèm query ?q=...
    const response = await axiosInstance.get(`http://localhost:8000/api/v1${url}`, {
        params: { q: keyword || '' },
      });      
    return response.data; // trả về danh sách phòng từ BE
  } catch (error) {
    console.error('Lỗi khi gọi API lọc phòng:', error);
    return [];
  }
};
