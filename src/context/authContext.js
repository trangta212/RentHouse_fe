import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { initSocket, disconnectSocket } from "../chat/socket"; // ⚠️ Nhớ sửa path nếu khác

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        initSocket();
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        sessionStorage.removeItem("authToken");
        disconnectSocket(); 
      }
    }else{
      disconnectSocket(); // Ngắt kết nối socket nếu không có token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
