import axios from "axios";

export const listHomeInformation = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/room`);
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
        const response = await axios.get(`http://localhost:8000/api/room/${id}`);
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

