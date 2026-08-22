import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref();

  const isAuthenticated = ref(!!user.value);

  const userInitial = computed(() => {
    return user.value?.name ? user.value.name.charAt(0).toUpperCase() : "U";
  });

  function login(userData) {
    user.value = userData;
    isAuthenticated.value = true;
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
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
