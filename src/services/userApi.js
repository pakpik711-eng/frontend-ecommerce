import { testAuth } from "./authApi";

const USER_URL = "http://http://10.17.48.87:8082";

let mockUser = {
  name: "Ravindran Logasanjeev",
  email: "ravindran@example.com",
  phone: "9876543210",
};

let mockAddresses = [
  {
    id: 1,
    title: "Home",
    street: "123 Tech Park Ave",
    city: "Coimbatore",
    zip: "641001",
  },
  {
    id: 2,
    title: "Office",
    street: "456 Innovation St",
    city: "Coimbatore",
    zip: "641004",
  },
];

let mockOrders = [
  {
    id: "ORD-9821",
    date: "Aug 18, 2026",
    status: "Delivered",
    total: 129.99,
    items: [
      { name: "Wireless Headphones", qty: 1, price: 99.99 },
      { name: "Protective Case", qty: 1, price: 30.0 },
    ],
  },
  {
    id: "ORD-9104",
    date: "Jul 02, 2026",
    status: "Processing",
    total: 45.5,
    items: [{ name: "USB-C Fast Charger", qty: 2, price: 22.75 }],
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  async fetchProfile() {
    await testAuth();
    // const hasToken = document.cookie
    //   .split("; ")
    //   .some((cookie) => cookie.startsWith("accessToken="));

    // if (!hasToken) {
    //   throw new Error("Not authenticated");
    // }

    return { ...mockUser };
  },

  // async fetchAddresses() {
  //   return await apiRequest(USER_URL, `/api/user/${}/addresses`, {
  //     method: "POST",
  //     body: {
  //       email: credentials.email,
  //       password: credentials.password,
  //       role: "USER",
  //     },
  //   });
  // },

  async updateProfile(userData) {
    await delay();
    mockUser = { ...mockUser, ...userData };
    return { ...mockUser };
  },

  async changePassword({ currentPassword, newPassword }) {
    await delay();
    if (currentPassword !== "password123") {
      throw new Error("Incorrect current password");
    }
    return { success: true, message: "Password updated successfully" };
  },

  async fetchAddresses() {
    await delay();
    return [...mockAddresses];
  },

  async addAddress(addressData) {
    await delay();
    const newAddr = { id: Date.now(), ...addressData };
    mockAddresses.push(newAddr);
    return newAddr;
  },

  async deleteAddress(id) {
    await delay();
    mockAddresses = mockAddresses.filter((addr) => addr.id !== id);
    return id;
  },

  async fetchOrders() {
    await delay();
    return [...mockOrders];
  },
};
