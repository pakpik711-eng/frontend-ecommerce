import { apiRequest } from "./api";
import { testAuth } from "./authApi";

const ORDER_URL = "http://10.17.48.87:8085/";

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

export async function placeOrder(orderData) {
  return apiRequest(ORDER_URL, "api/orders", {
    method: "POST",
    body: orderData,
  });
}

export async function fetchOrder(orderId) {
  return apiRequest(ORDER_URL, `api/orders/${orderId}`);
}

export async function fetchOrders() {
  const userId = await getUserId();

  return apiRequest(
    ORDER_URL,
    `api/orders?userId=${encodeURIComponent(userId)}`,
  );
}

export async function fetchOrderStatus(orderId) {
  return apiRequest(ORDER_URL, `api/orders/${orderId}/status`);
}

export async function cancelOrder(orderId) {
  return apiRequest(ORDER_URL, `api/orders/${orderId}/cancel`, {
    method: "POST",
  });
}
