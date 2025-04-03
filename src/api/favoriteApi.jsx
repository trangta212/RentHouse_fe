import axiosInstance from "../untils/axiosInstance.js";

const addFavoriteRooms = async (roomIds) => {
try {
  const response = await axiosInstance.post("/favorite/add", { roomIds });
  return response.data; // Trả về dữ liệu từ server nếu thành công
} catch (error) {
  // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
  if (error.response) {
    const { status, data } = error.response;
    console.error(`Error ${status}: ${data.message || "Unknown error"}`);

    // Nếu lỗi là do phòng đã tồn tại, bạn có thể xử lý riêng
    if (status === 409) {
      return { message: "Phòng đã tồn tại trong danh sách yêu thích" };
    }
  }

  // Ném lỗi nếu không xử lý được
  throw error;
}
};

const getFavoriteRooms = async () => {
try {
  const response = await axiosInstance.get("/favorite/list");
  return response.data; // Trả về dữ liệu từ server nếu thành công
}catch (error) {
  // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
  if (error.response) {
    const { status, data } = error.response;
    console.error(`Error ${status}: ${data.message || "Unknown error"}`);

    // Nếu lỗi là do phòng đã tồn tại, bạn có thể xử lý riêng
    if (status === 409) {
      return { message: "Không tồn tại trong danh sách yêu thích" };
    }
  }

  // Ném lỗi nếu không xử lý được
  throw error;
}
}
const removeFavoriteRooms = async (roomIds) => {
  try {
    const response = await axiosInstance.delete("/favorite/remove", {
      data: { roomIds },
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu server trả về lỗi với thông báo cụ thể
    if (error.response) {
      const { status, data } = error.response;
      console.error(`Error ${status}: ${data.message || "Unknown error"}`);

      // Nếu lỗi là do phòng không tồn tại, bạn có thể xử lý riêng
      if (status === 404) {
        return { message: "Không tìm thấy các phòng trong danh sách yêu thích" };
      }
    }

    // Ném lỗi nếu không xử lý được
    throw error;
  }
};


export {
  addFavoriteRooms,
  getFavoriteRooms,
  removeFavoriteRooms
};