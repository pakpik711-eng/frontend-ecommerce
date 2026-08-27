import { apiRequest } from "./api";
import { testAuth } from "./authApi";

const USER_URL = "http://10.17.48.87:8082/api/users";

async function getUserId() {
  const response = await testAuth();

  if (!response || typeof response !== "string") {
    throw new Error("Invalid authentication response");
  }

  const match = response.match(
    /User:\s*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/,
  );

  if (!match) {
    throw new Error("Unable to extract user ID from auth response");
  }

  return match[1];
}

export const userApi = {
  async fetchProfile() {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}`);
  },

  async updateProfile(profileData) {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}`, {
      method: "PATCH",
      body: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
      },
    });
  },

  async fetchAddresses() {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}/addresses`);
  },

  async fetchDefaultAddress() {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}/addresses/default`);
  },

  async fetchAddress(addressId) {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}/addresses/${addressId}`);
  },

  async addAddress(addressData) {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}/addresses`, {
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
    const userId = await getUserId();

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

    return apiRequest(USER_URL, `/${userId}/addresses/${addressId}`, {
      method: "PATCH",
      body,
    });
  },

  async setDefaultAddress(addressId) {
    const userId = await getUserId();

    return apiRequest(USER_URL, `/${userId}/addresses/${addressId}/default`, {
      method: "PATCH",
    });
  },

  async deleteAddress(addressId) {
    const userId = await getUserId();

    await apiRequest(USER_URL, `/${userId}/addresses/${addressId}`, {
      method: "DELETE",
    });

    return addressId;
  },
};
