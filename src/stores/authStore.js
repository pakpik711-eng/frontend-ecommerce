import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginUser } from "../services/authApi";

export const useAuthStore = defineStore("auth", () => {
  const storedUser = localStorage.getItem("user");

  const user = ref(storedUser ? JSON.parse(storedUser) : null);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    return cookie ? cookie.split("=")[1] : null;
  };

  const isAuthenticated = ref(!!getCookie("accessToken"));

  const userInitial = computed(() => {
    return user.value?.name ? user.value.name.charAt(0).toUpperCase() : "U";
  });

  function login(userCredentials) {
    const res = loginUser({ ...userCredentials });
    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
      isAuthenticated.value = true;
      user.value = res;
      console.log("logged in");
    } else console.log("invalid credentials");
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    document.cookie = "accessToken=; Path=/; Max-Age=0";
    localStorage.removeItem("user");
  }

  return {
    user,
    isAuthenticated,
    userInitial,
    login,
    logout,
  };
});
