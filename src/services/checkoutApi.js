import { apiRequest } from "./api";
import { getCurrentUserId } from "./session";


export async function checkoutCart(customAddress) {
  return apiRequest("/api/cart/checkout", {
    method: "POST",
    body: customAddress,
  });
}

export async function checkoutCartItem(cartItemId, customAddress) {
  return apiRequest(`/api/cart/checkout/${cartItemId}`, {
    method: "POST",
    body: customAddress,
  });
}

export async function fetchOrder(orderId) {
  return apiRequest(`/api/orders/${orderId}`);
}

export async function fetchOrders() {
  const userId = getCurrentUserId();

  return apiRequest(`/api/orders?userId=${encodeURIComponent(userId)}`);
}

export async function fetchOrderStatus(orderId) {
  return apiRequest(`/api/orders/${orderId}/status`);
}

export async function cancelOrder(orderId) {
  return apiRequest(`/api/orders/${orderId}/cancel`, {
    method: "POST",
  });
}
