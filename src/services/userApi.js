import { apiRequest } from "./api";
import { getCurrentUserId } from "./session";

export const userApi = {
  async fetchProfile() {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}`);
  },

  async updateProfile(profileData) {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
      },
    });
  },

  async fetchAddresses() {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}/addresses`);
  },

  async fetchDefaultAddress() {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}/addresses/default`);
  },

  async fetchAddress(addressId) {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}/addresses/${addressId}`);
  },

  async addAddress(addressData) {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}/addresses`, {
      method: "POST",
      body: {
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || null,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        pincode: addressData.pincode,
        isDefault: addressData.isDefault ?? false,
      },
    });
  },

  async updateAddress(addressId, addressData) {
    const userId = getCurrentUserId();

    const body = {};

    if (addressData.addressLine1 !== undefined) {
      body.addressLine1 = addressData.addressLine1;
    }

    if (addressData.addressLine2 !== undefined) {
      body.addressLine2 = addressData.addressLine2;
    }

    if (addressData.city !== undefined) {
      body.city = addressData.city;
    }

    if (addressData.state !== undefined) {
      body.state = addressData.state;
    }

    if (addressData.country !== undefined) {
      body.country = addressData.country;
    }

    if (addressData.pincode !== undefined) {
      body.pincode = addressData.pincode;
    }

    return apiRequest(`/api/users/${userId}/addresses/${addressId}`, {
      method: "PATCH",
      body,
    });
  },

  async setDefaultAddress(addressId) {
    const userId = getCurrentUserId();

    return apiRequest(`/api/users/${userId}/addresses/${addressId}/default`, {
      method: "PATCH",
    });
  },

  async deleteAddress(addressId) {
    const userId = getCurrentUserId();

    await apiRequest(`/api/users/${userId}/addresses/${addressId}`, {
      method: "DELETE",
    });

    return addressId;
  },
};
