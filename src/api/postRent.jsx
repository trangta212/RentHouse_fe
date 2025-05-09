import axios from "axios";
import axiosInstance from "../untils/axiosInstance.js";

export const PostRentCreate = async (postData) => {
  try {
    if (!postData) {
      throw new Error("Dữ liệu không được để trống");
    }

    const response = await axiosInstance.post(
      `http://localhost:8000/api/v1/post/create-post`,
      postData,
      {
        headers: {
          // "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "Lỗi từ server");
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error("No response received:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khi thiết lập request
      console.error("Request error:", error.message);
      throw new Error("Lỗi khi gửi yêu cầu");
    }
  }
};

export const PostRentUpdate = async (postId, postData) => {
  try {
    if (!postId) {
      throw new Error("ID bài đăng không được để trống");
    }

    if (!postData) {
      throw new Error("Dữ liệu không được để trống");
    }

    const response = await axios.put(
      `http://localhost:8000/api/v1/post/update-post/${postId}`,
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "Lỗi từ server");
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error("No response received:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khi thiết lập request
      console.error("Request error:", error.message);
      throw new Error("Lỗi khi gửi yêu cầu");
    }
  }
};
export const getPostByUser = async () => {
  try {
    const response = await axiosInstance.get(
      `post/get-post-by-user`
    );

    if (!response || !response.data) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "Lỗi từ server");
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error("No response received:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khi thiết lập request
      console.error("Request error:", error.message);
      throw new Error("Lỗi khi gửi yêu cầu");
    }
  }
}
export const updatePostInformationByUser = async (postId,postData) => {
  try {
    const response = await axiosInstance.put(
      `post/update-post-by-user/${postId}`,
      postData
    );

    if (!response || !response.data) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "Lỗi từ server");
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error("No response received:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Lỗi khi thiết lập request
      console.error("Request error:", error.message);
      throw new Error("Lỗi khi gửi yêu cầu");
    }
  }
}