import { apiRequest } from "./api";



export function getCartCount() {
  return apiRequest("/api/cart/count");
}

export function getCart() {
  return apiRequest("/api/cart");
}

export function addCartItem(item) {
  return apiRequest("/api/cart/items", {
    method: "POST",
    body: item,
  });
}

export function updateCartItemQuantity(cartItemId, quantity) {
  return apiRequest(`/api/cart/items/${cartItemId}`, {
    method: "PATCH",
    body: { quantity },
  });
}

export function removeItemCartItem(cartItemId) {
  return apiRequest(`/api/cart/items/${cartItemId}`, {
    method: "DELETE",
  });
}

export function validateCart() {
  return apiRequest("/api/cart/validate", {
    method: "POST",
  });
}

export function buyNow(item) {
  return apiRequest("/api/cart/buy-now", {
    method: "POST",
    body: item,
  });
}
