import axiosInstance from "../untils/axiosInstance.js";


export const listHomeInformation = async () => {
    try {
        const response = await axiosInstance.get(`/room`);
        if (response.status === 200) {
            return response.data;
          } else {
            console.error("Error fetching customer:", response.data.message);
          }
        } catch (error) {
          console.error(
            "Error fetching places:",
            error.response?.data || error.message
          );
}}

export const detailRoomInformation = async (id) => {
    try {
        const response = await axiosInstance.get(`/room/${id}`);
        if (response.status === 200) {
            return response.data;
          } else {
            console.error("Error fetching customer:", response.data.message);
          }
        } catch (error) {
          console.error(
            "Error fetching places:",
            error.response?.data || error.message
          );
}}
export const searchNearByRoom = async (latitude,longitude,radius) =>{
    try {
        const response = await axiosInstance.get(`/room/near-room?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
        if (response.status === 200) {
            return response.data;
          } else {
            console.error("Error fetching customer:", response.data.message);
          }
        } catch (error) {
          console.error(
            "Error fetching places:",
            error.response?.data || error.message
          );
        }
}  
export const searchRelatedRoom = async (address, type, excludeId) => {
  console.log("📤 Gọi API với params:", { address, type, excludeId });

  try {
    const response = await axiosInstance.get(
      `/room/related?address=${encodeURIComponent(address)}&type=${type}&excludeId=${excludeId}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("⚠️ Lỗi phản hồi từ API:", response.data.message);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error.response?.data || error.message);
  }
};

