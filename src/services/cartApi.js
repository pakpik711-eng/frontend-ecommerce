import { apiRequest } from "./api";

const CART_URL = "http://10.17.48.83:8086";
const u_id = "550e8400-e29b-41d4-a716-446655440000";

export function getCartCount() {
  return apiRequest(CART_URL, `/api/cart/${u_id}/count`);
}

export function getCart() {
  return apiRequest(CART_URL, `/api/cart/${u_id}`);
}

export function addCartItem(cartItems) {
  return apiRequest(CART_URL, `/api/cart/${u_id}/items`, {
    method: "POST",
    body: cartItems,
  });
}

export function updateCartItemQuantity(cartItemId, quantity) {
  return apiRequest(CART_URL, `/api/${u_id}/cart/items/${cartItemId}`, {
    method: "PATCH",
    body: quantity,
  });
}

export function removeItemCartItem(cartItemId) {
  return apiRequest(CART_URL, `/api/cart/${u_id}/items/${cartItemId}`, {
    method: "DELETE",
  });
}

export function validateCart() {
  return apiRequest(`/api/cart/${u_id}/validate`, {
    method: "POST",
  });
}
