import { defineStore } from "pinia";
import { ref } from "vue";
import {
  registerUser,
  loginUser,
  logoutUser,
  initiateGoogleAuth,

} from "@/services/authApi";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const authInitialized = ref(false);

  function loginWithGoogle() {
    initiateGoogleAuth();
  }

  function login(credentials) {
    return loginUser(credentials).then(() => {
      isAuthenticated.value = true;
      authInitialized.value = true;

      return true;
    });
  }

  function register(credentials) {
    return registerUser(credentials).then(() => login(credentials));
  }

  function initializeAuth() {
    authInitialized.value = false;

    return testAuth()
      .then(
        () => {
          isAuthenticated.value = true;
        },
        () => {
          isAuthenticated.value = false;
        },
      )
      .finally(() => {
        authInitialized.value = true;
      });
  }

  function logout() {
    return logoutUser().then(
      () => {
        isAuthenticated.value = false;
        authInitialized.value = true;
      },
      (error) => {
        isAuthenticated.value = false;
        authInitialized.value = true;

        return Promise.reject(error);
      },
    );
  }

  return {
    isAuthenticated,
    authInitialized,
    login,
    register,
    loginWithGoogle,
    logout,
    initializeAuth,
  };
});
