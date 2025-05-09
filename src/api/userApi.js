import axiosInstance from "../untils/axiosInstance.js";
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}
export const updateUserInfo = async(userData) => {
  try {
    const response = await axiosInstance.put("/user/update-profile", userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
}