import { apiRequest } from "./api";

export function placeOrder(orderData) {
  return apiRequest("/api/orders", {
    method: "POST",
    body: orderData,
  });
}

let mockOrders = [
  {
    id: "ORD-9821",
    date: "Aug 18, 2026",
    status: "Delivered",
    total: 129.99,
    items: [
      {
        productId: "prod-101",
        variantId: "var-201",
        merchantId: "merch-301",
        name: "Wireless Headphones",
        qty: 1,
        price: 99.99,
        thumbnail:
          "https://via.placeholder.com/48/2563eb/ffffff?text=Headphones",
      },
      {
        productId: "prod-102",
        variantId: "var-202",
        merchantId: "merch-301",
        name: "Protective Case",
        qty: 1,
        price: 30.0,
        thumbnail: "https://via.placeholder.com/48/4b5563/ffffff?text=Case",
      },
    ],
  },
  {
    id: "ORD-9104",
    date: "Jul 02, 2026",
    status: "Processing",
    total: 45.5,
    items: [
      {
        productId: "prod-103",
        variantId: "var-203",
        merchantId: "merch-302",
        name: "USB-C Fast Charger",
        qty: 2,
        price: 22.75,
        thumbnail: "https://via.placeholder.com/48/10b981/ffffff?text=Charger",
      },
    ],
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchOrders() {
  await delay();
  return [...mockOrders];
}

export async function withdrawOrder(id) {
  await delay();
  const order = mockOrders.find((o) => o.id === id);
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status === "Delivered") {
    throw new Error("Cannot cancel a delivered order");
  }
  order.status = "Cancelled";
  return { ...order };
}
