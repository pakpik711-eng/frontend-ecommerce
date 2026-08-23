import { defineStore } from "pinia";
import { ref } from "vue";
import { userApi } from "@/services/userApi";

export const useUserStore = defineStore("user", () => {
  const profile = ref(null);
  const addresses = ref([]);
  const orders = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function loadProfile() {
    isLoading.value = true;
    error.value = null;
    try {
      profile.value = await userApi.fetchProfile();
    } catch (err) {
      error.value = err.message || "Failed to load profile";
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(userData) {
    isLoading.value = true;
    error.value = null;
    try {
      profile.value = await userApi.updateProfile(userData);
    } catch (err) {
      error.value = err.message || "Failed to update profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePassword(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      return await userApi.changePassword(credentials);
    } catch (err) {
      error.value = err.message || "Failed to change password";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadAddresses() {
    isLoading.value = true;
    error.value = null;
    try {
      addresses.value = await userApi.fetchAddresses();
    } catch (err) {
      error.value = err.message || "Failed to load addresses";
    } finally {
      isLoading.value = false;
    }
  }

  async function addAddress(addressData) {
    isLoading.value = true;
    error.value = null;
    try {
      const newAddress = await userApi.addAddress(addressData);
      addresses.value.push(newAddress);
    } catch (err) {
      error.value = err.message || "Failed to add address";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeAddress(id) {
    isLoading.value = true;
    error.value = null;
    try {
      await userApi.deleteAddress(id);
      addresses.value = addresses.value.filter((addr) => addr.id !== id);
    } catch (err) {
      error.value = err.message || "Failed to remove address";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadOrders() {
    isLoading.value = true;
    error.value = null;
    try {
      orders.value = await userApi.fetchOrders();
    } catch (err) {
      error.value = err.message || "Failed to load orders";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    profile,
    addresses,
    orders,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    updatePassword,
    loadAddresses,
    addAddress,
    removeAddress,
    loadOrders,
  };
});


