import axiosInstance from "../untils/axiosInstance.js";
export const getCalendarPost = async () => {
    try {
      // Check if token exists
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      console.log("Making request to get monthly post count...");
      const response = await axiosInstance.get("/post/get-monthly-post-count");
      console.log("Response received:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.message || "Unknown error"}`);
    
        if (status === 401) {
          // Clear invalid token
          sessionStorage.removeItem("authToken");
          throw new Error("Session expired. Please log in again.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        throw error;
      }
      throw error;
    }
}
