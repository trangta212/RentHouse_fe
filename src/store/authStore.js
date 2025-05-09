// import { create } from "zustand";
// import { jwtDecode } from "jwt-decode";

// const useAuthStore = create((set) => ({
//   user: null,
//   token: sessionStorage.getItem("authToken") || null, // Giữ token sau reload

//   login: (token) => {
//     const user = jwtDecode(token);
//     sessionStorage.setItem("authToken", token);
//     sessionStorage.setItem("auth", JSON.stringify(user));
//     set({ user, token });
//   },

//   logout: () => {
//     sessionStorage.removeItem("authToken");
//     sessionStorage.removeItem("auth");
//     set({ user: null, token: null });
//   },
// }));

// export default useAuthStore;
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const tokenFromStorage = sessionStorage.getItem("authToken");
let userFromToken = null;

if (tokenFromStorage) {
  try {
    userFromToken = jwtDecode(tokenFromStorage);
  } catch (err) {
    console.error("Invalid token", err);
    sessionStorage.removeItem("authToken");
  }
}

const useAuthStore = create((set) => ({
  user: userFromToken,
  token: tokenFromStorage,

  login: (token) => {
    try {
      const user = jwtDecode(token);
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("auth", JSON.stringify(user));
      set({ user, token });
    } catch (err) {
      console.error("Login failed: Invalid token", err);
    }
  },

  logout: () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("auth");
    set({ user: null, token: null });
  },

  setUser: (userData) => set({ user: userData }), // để cập nhật sau khi fetch
}));

export default useAuthStore;
