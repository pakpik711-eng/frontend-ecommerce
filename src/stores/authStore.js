import { defineStore } from "pinia";
import { ref } from "vue";
import {
  registerUser,
  loginUser,
  logoutUser,
  initiateGoogleAuth,
  getCurrentUser,
} from "@/services/authApi";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const authInitialized = ref(false);

  
  const userId = ref(null);
  const email = ref(null);
  const role = ref(null);

  function setIdentity(user) {
    userId.value = user?.userId ?? null;
    email.value = user?.email ?? null;
    role.value = user?.role ?? null;
  }

  function clearIdentity() {
    userId.value = null;
    email.value = null;
    role.value = null;
  }

  function loginWithGoogle() {
    initiateGoogleAuth();
  }

  function login(credentials) {
    return loginUser(credentials)
      .then(() => initializeAuth())
      .then(() => {
      
        if (!isAuthenticated.value) {
          throw new Error("Login succeeded but session could not be verified");
        }
      });
  }

  function register(credentials) {
    return registerUser(credentials).then(() => login(credentials));
  }

 
  function initializeAuth() {
    authInitialized.value = false;

    return getCurrentUser()
      .then((user) => {
        setIdentity(user);
        isAuthenticated.value = true;
      })
      .catch((error) => {
       
        if (error?.status !== 401) {
          console.error("Failed to check auth status:", error);
        }

        clearIdentity();
        isAuthenticated.value = false;
      })
      .finally(() => {
        authInitialized.value = true;
      });
  }

  function logout() {
    return logoutUser().then(
      () => {
        isAuthenticated.value = false;
        authInitialized.value = true;
        clearIdentity();
      },
      (error) => {
        isAuthenticated.value = false;
        authInitialized.value = true;
        clearIdentity();

        return Promise.reject(error);
      },
    );
  }

  function handleSessionExpired() {
    isAuthenticated.value = false;
    clearIdentity();
  }

  return {
    isAuthenticated,
    authInitialized,
    userId,
    email,
    role,
    login,
    register,
    loginWithGoogle,
    logout,
    initializeAuth,
    handleSessionExpired,
  };
});
