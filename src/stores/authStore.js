import { defineStore } from "pinia";
import { ref } from "vue";
import { loginUser, getCurrentUser, logoutUser } from "@/services/authApi";
import { useUserStore } from "./userStore";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const authInitialized = ref(false);

  async function login(credentials) {
    try {
      await loginUser(credentials);

      isAuthenticated.value = true;
      const userStore = useUserStore();
      userStore.loadProfile();
      return true;
    } catch (error) {
      isAuthenticated.value = false;
      throw error;
    }
  }

  async function initializeAuth() {
    try {
      await getCurrentUser();
      isAuthenticated.value = true;

      const userStore = useUserStore();
      await userStore.loadProfile();
    } catch {
      isAuthenticated.value = false;
    } finally {
      authInitialized.value = true;
    }
  }

  function logout() {
    logoutUser();
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    authInitialized,
    login,
    logout,
    initializeAuth,
  };
});
