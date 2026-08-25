import { defineStore } from "pinia";
import { ref } from "vue";
import {
  registerUser,
  loginUser,
  logoutUser,
  initiateGoogleAuth,
  testAuth,
} from "@/services/authApi";
import { useUserStore } from "./userStore";
import { userApi } from "@/services/userApi";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const authInitialized = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  function loginWithGoogle() {
    initiateGoogleAuth();
  }

  async function login(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      await loginUser(credentials);
      isAuthenticated.value = true;
      const userStore = useUserStore();
      userStore.loadProfile();
      return true;
    } catch (err) {
      isAuthenticated.value = false;
      error.value = err.message || "Failed to log in";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      await registerUser(credentials);
    } catch (err) {
      error.value = err.message || "Failed to sign up";
      isLoading.value = false;
      throw err;
    }

    isLoading.value = false;
    return await login(credentials);
  }

  async function initializeAuth() {
    isLoading.value = true;
    error.value = null;
    try {
      const userData = await userApi.fetchProfile();

      const userStore = useUserStore();
      userStore.profile = userData;
      // await testAuth();

      isAuthenticated.value = true;
    } catch (err) {
      console.log("Not authenticated");
      isAuthenticated.value = false;
    } finally {
      isLoading.value = false;
      authInitialized.value = true;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await logoutUser();
    } catch (err) {
      error.value = err.message || "Failed to log out";
      throw err;
    } finally {
      isAuthenticated.value = false;
      isLoading.value = false;
    }
  }

  return {
    isAuthenticated,
    authInitialized,
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    initializeAuth,
  };
});
