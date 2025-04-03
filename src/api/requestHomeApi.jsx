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

