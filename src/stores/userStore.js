import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { userApi } from "@/services/userApi";

export const useUserStore = defineStore("user", () => {
  const profile = ref(null);
  const addresses = ref([]);

  const userInitial = computed(() => {
    if (profile.value?.firstName) {
      return profile.value.firstName.charAt(0).toUpperCase();
    }

    if (profile.value?.lastName) {
      return profile.value.lastName.charAt(0).toUpperCase();
    }

    if (profile.value?.email) {
      return profile.value.email.charAt(0).toUpperCase();
    }

    return "U";
  });

  function setProfile(user) {
    profile.value = user;
  }

  function clearProfile() {
    profile.value = null;
  }

  function setAddresses(value) {
    addresses.value = value;
  }

  function addAddressToStore(address) {
    addresses.value.push(address);
  }

  function updateAddressInStore(updatedAddress) {
    const index = addresses.value.findIndex(
      (address) => address.id === updatedAddress.id,
    );

    if (index !== -1) {
      addresses.value[index] = updatedAddress;
    }
  }

  function removeAddressFromStore(id) {
    addresses.value = addresses.value.filter((address) => address.id !== id);
  }

  function loadAddresses() {
    return userApi.fetchAddresses().then((data) => {
      setAddresses(data);
      return data;
    });
  }

  function addAddress(addressData) {
    return userApi.addAddress(addressData).then((address) => {
      addAddressToStore(address);
      return address;
    });
  }

  function updateAddress(id, addressData) {
    return userApi.updateAddress(id, addressData).then((updatedAddress) => {
      updateAddressInStore(updatedAddress);
      return updatedAddress;
    });
  }

  function setDefaultAddress(id) {
    return userApi.setDefaultAddress(id).then(() => {
      return loadAddresses();
    });
  }

  function removeAddress(id) {
    return userApi.deleteAddress(id).then(() => {
      removeAddressFromStore(id);
      return id;
    });
  }

  return {
    profile,
    addresses,
    userInitial,
    setProfile,
    clearProfile,
    setAddresses,
    addAddressToStore,
    updateAddressInStore,
    removeAddressFromStore,
    loadAddresses,
    addAddress,
    updateAddress,
    setDefaultAddress,
    removeAddress,
  };
});
