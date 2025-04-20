import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set) => ({
  user: null,
  token: sessionStorage.getItem("authToken") || null, // Giữ token sau reload

  login: (token) => {
    const user = jwtDecode(token);
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("auth", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("auth");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
