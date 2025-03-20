// Kiểm tra biến môi trường
const checkEnvironmentVariables = () => {
  console.log("=== Kiểm tra biến môi trường ===");

  // Kiểm tra Hugging Face API Key
  console.log("\n1. Hugging Face API Key:");
  console.log(
    "- Tồn tại:",
    process.env.REACT_APP_HUGGINGFACE_API_KEY ? "✅ Có" : "❌ Không"
  );
  console.log(
    "- Độ dài:",
    process.env.REACT_APP_HUGGINGFACE_API_KEY?.length || 0,
    "ký tự"
  );
  console.log(
    "- Định dạng hợp lệ:",
    process.env.REACT_APP_HUGGINGFACE_API_KEY?.startsWith("hf_")
      ? "✅ Đúng"
      : "❌ Sai"
  );

  // Kiểm tra NODE_ENV
  console.log("\n2. Môi trường:");
  console.log("- NODE_ENV:", process.env.NODE_ENV || "không được set");
  console.log(
    "- Development:",
    process.env.NODE_ENV === "development" ? "✅" : "❌"
  );
  console.log(
    "- Production:",
    process.env.NODE_ENV === "production" ? "✅" : "❌"
  );

  console.log("\n=== Kết thúc kiểm tra ===\n");
};

// Chạy kiểm tra khi khởi động
checkEnvironmentVariables();

// Hàm format số tiền
const formatCurrency = (amount) => {
  if (!amount) return "0";
  // Remove non-numeric characters
  const numericValue = amount.toString().replace(/[^0-9]/g, "");
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericValue);
};

// Hàm tạo prompt cho tiêu đề
const createTitlePrompt = (data) => {
  return `Tạo một tiêu đề ngắn gọn, hấp dẫn cho tin đăng cho thuê bất động sản với các thông tin sau:
- Loại bất động sản: ${data.propertyType}
- Diện tích: ${data.area}m2
- Vị trí: ${data.location}
- Giá thuê: ${data.price} đồng/tháng

Yêu cầu:
- Độ dài tiêu đề từ 50-70 ký tự
- Đảm bảo có đầy đủ thông tin quan trọng: loại BĐS, diện tích, vị trí
- Sử dụng từ ngữ thu hút người thuê
- Không sử dụng các ký tự đặc biệt`;
};

// Hàm tạo prompt cho mô tả
const createDescriptionPrompt = (data) => {
  return `Tạo một bài mô tả chi tiết, chuyên nghiệp cho tin đăng cho thuê bất động sản với các thông tin sau:
- Loại bất động sản: ${data.propertyType}
- Diện tích: ${data.area}m2
- Vị trí: ${data.location}
- Số phòng ngủ: ${data.bedrooms}
- Số phòng tắm: ${data.bathrooms}
- Nội thất: ${data.interior}
- Tiện ích: ${data.utilities}
- Giá thuê: ${data.price} đồng/tháng

Yêu cầu:
- Độ dài mô tả từ 500-1000 ký tự
- Cấu trúc rõ ràng, dễ đọc
- Nhấn mạnh các điểm nổi bật của bất động sản
- Sử dụng ngôn ngữ chuyên nghiệp, thân thiện
- Thêm call-to-action ở cuối
- Có thể sử dụng emoji để tăng tính thu hút`;
};

// Hàm validate dữ liệu form
export const validateFormData = (formData) => {
  const { propertyType, area, location, price } = formData;

  if (!propertyType) {
    throw new Error("Vui lòng chọn loại bất động sản");
  }

  if (!area || isNaN(Number(area))) {
    throw new Error("Vui lòng nhập diện tích hợp lệ");
  }

  if (!location) {
    throw new Error("Vui lòng chọn địa điểm");
  }

  if (!price || isNaN(Number(price))) {
    throw new Error("Vui lòng nhập giá hợp lệ");
  }
};

// Hàm gọi API để tạo nội dung
export const generateContent = async (type, formData) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${MAX_RETRIES}`);
      console.log("Form data:", formData);

      // Validate form data
      validateFormData(formData);

      // Format data before sending
      const requestData = {
        type,
        formData: {
          propertyType: formData.propertyType,
          area: Number(formData.area),
          location: formData.location,
          price: Number(formData.price),
          interior: formData.interior || "Cơ bản",
          utilities: formData.utilities || [],
        },
      };

      console.log("Sending request:", requestData);

      const response = await fetch(
        "http://localhost:8080/api/ai/generate-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response status:", response.status);

      // Handle specific HTTP status codes
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error(
              "API endpoint không tồn tại. Vui lòng kiểm tra URL."
            );
          case 500:
            throw new Error("Lỗi server. Vui lòng thử lại sau.");
          case 400:
            const errorData = await response.json();
            throw new Error(errorData.error || "Dữ liệu không hợp lệ.");
          case 403:
            throw new Error(
              "Không có quyền truy cập API. Vui lòng kiểm tra API key."
            );
          default:
            throw new Error(`Lỗi không xác định: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!data.content) {
        throw new Error("Không nhận được nội dung từ máy chủ");
      }

      return data.content;
    } catch (error) {
      console.error(`Error in attempt ${attempt}:`, error);

      // Network errors
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        if (attempt === MAX_RETRIES) {
          throw new Error(`Không thể kết nối đến máy chủ sau ${MAX_RETRIES} lần thử. Vui lòng kiểm tra:
1. Backend server đã chạy chưa? (http://localhost:8080)
2. Không có lỗi CORS
3. Mạng internet đang hoạt động
4. Cổng 8080 không bị chặn bởi tường lửa`);
        }

        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        continue;
      }

      // Other errors
      throw error;
    }
  }
};

// Test function
const testAI = async () => {
  try {
    // Test data for a property listing
    const testData = {
      propertyType: "Chung cư",
      area: "75",
      location: "Hà Nội",
      price: "8000000",
      interior: "Đầy đủ",
      utilities: ["Camera", "Bảo vệ", "PCCC"],
    };

    console.log("Testing AI content generation...");

    // Test title generation
    console.log("1. Testing title generation:");
    const title = await generateContent("title", testData);
    console.log("Generated title:", title);

    // Test description generation
    console.log("\n2. Testing description generation:");
    const description = await generateContent("description", testData);
    console.log("Generated description:", description);
  } catch (error) {
    console.error("AI test error:", error.message);
  }
};

// Only run test in development environment
if (process.env.NODE_ENV === "development") {
  testAI();
}
