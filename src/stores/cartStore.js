import {
  addCartItem,
  buyNow as buyNowApi,
  getCart,
  getCartCount,
  removeItemCartItem,
  updateCartItemQuantity,
} from "@/services/cartApi";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const actionError = ref(null);
  const totalPrice = ref(0);
  const cartCount = ref(0);

  const checkoutAuthorized = ref(false);

  function authorizeCheckoutNavigation() {
    checkoutAuthorized.value = true;
  }

  function consumeCheckoutAuthorization() {
    const authorized = checkoutAuthorized.value;
    checkoutAuthorized.value = false;
    return authorized;
  }

  function applyCartSnapshot(cartResponse) {
    cartItems.value = cartResponse.items || [];
    totalPrice.value = cartResponse.totalPrice;
    cartCount.value = cartItems.value.length;
  }

  function fetchCartCount() {
    return getCartCount()
      .then((response) => {
        cartCount.value = response.distinctItemCount;
      })
      .catch((err) => {
        cartCount.value = 0;
        console.error("Failed to fetch cart count:", err);
      });
  }

  function fetchCart() {
    loading.value = true;
    error.value = null;

    return getCart()
      .then((response) => {
        applyCartSnapshot(response);
      })
      .catch((err) => {
        error.value = "Failed to Load cart";
        console.error("Failed to fetch cart:", err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function addItem(item) {
    loading.value = true;
    actionError.value = null;

    return addCartItem(item)
      .then((response) => {
        applyCartSnapshot(response);
        return response;
      })
      .catch((err) => {
        actionError.value = err;
        // console.error("Failed to add cart item:", err);
        throw err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function buyNow(item) {
    loading.value = true;
    actionError.value = null;

    return buyNowApi(item)
      .then((response) => {
        if (response.items) {
          applyCartSnapshot(response);
        }

        const cartItemId =
          response.cartItemId ||
          response.items?.find(
            (cartItem) =>
              cartItem.variantId === item.variantId &&
              cartItem.merchantId === item.merchantId,
          )?.cartItemId;

        if (!cartItemId) {
          throw new Error("Buy Now did not return a cart item");
        }

        if (!response.items) {
          return fetchCart().then(() => cartItemId);
        }

        return cartItemId;
      })
      .catch((err) => {
        actionError.value = err;
        console.error("Failed to buy now:", err);
        throw err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function increaseQuantity(cartItemId) {
    const item = cartItems.value.find((item) => item.cartItemId === cartItemId);

    if (!item) return Promise.resolve();

    if (item.quantity >= item.availableStock) {
      actionError.value = "Out of stock";
      return Promise.resolve();
    }

    return changeQuantity(cartItemId, item.quantity + 1);
  }

  function decreaseQuantity(cartItemId) {
    const item = cartItems.value.find((item) => item.cartItemId === cartItemId);

    if (!item) return Promise.resolve();

    if (item.quantity <= 1) {
      return Promise.resolve();
    }

    return changeQuantity(cartItemId, item.quantity - 1);
  }

  function changeQuantity(cartItemId, quantity) {
    actionError.value = null;

    return updateCartItemQuantity(cartItemId, quantity)
      .then((response) => {
        const index = cartItems.value.findIndex(
          (item) => item.cartItemId === cartItemId,
        );

        if (index !== -1) {
          cartItems.value[index].quantity = response.quantity;
          cartItems.value[index].lineTotal = response.lineTotal;
        }

        totalPrice.value = response.cartTotalPrice;
      })
      .catch((err) => {
        actionError.value = "Unable to update quantity";
        console.error("Unable to update quantity:", err);
        throw err;
      });
  }

  function removeItem(cartItemId) {
    actionError.value = null;

    return removeItemCartItem(cartItemId)
      .then((response) => {
        applyCartSnapshot(response);
      })
      .catch((err) => {
        actionError.value = "Unable to remove item";
        console.error("Unable to remove item:", err);
        throw err;
      });
  }

  function clearCartCount() {
    cartCount.value = 0;
  }

  return {
    cartItems,
    loading,
    error,
    actionError,
    totalPrice,
    cartCount,

    fetchCart,
    fetchCartCount,

    increaseQuantity,
    decreaseQuantity,
    changeQuantity,

    removeItem,
    addItem,
    buyNow,
    authorizeCheckoutNavigation,
    consumeCheckoutAuthorization,

    clearCartCount,
  };
});

