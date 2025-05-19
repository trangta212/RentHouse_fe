import axios from "axios";

// Hàm gửi query đến Flask backend và nhận response
export const sendQueryToLLM = async (query) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/llm", {
      query: query,
    });
    return response.data; // Trả về {query, response, response_time}
  } catch (error) {
    throw new Error("Ôi, có lỗi xảy ra rồi 😓. Bạn thử lại nhé!");
  }
};
