/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns {boolean} Trạng thái đăng nhập
 */
export const isAuthenticated = () => {
    const token = sessionStorage.getItem('authToken');
    return !!token; // Chuyển đổi token thành boolean
  };
  
  /**
   * Lấy token từ localStorage
   * @returns {string|null} Access token hoặc null nếu không có
   */
  export const getToken = () => {
    return sessionStorage.getItem('authToken');
  };
  
  /**
   * Lưu token vào localStorage
   * @param {string} token - Access token
   */
  export const setToken = (token) => {
    sessionStorage.setItem('authToken', token);
  };
  
  /**
   * Xóa token khỏi localStorage (đăng xuất)
   */
  export const removeToken = () => {
    sessionStorage.removeItem('authToken');
  };