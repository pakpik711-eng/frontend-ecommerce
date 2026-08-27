import {addCartItem,getCart,getCartCount,removeItemCartItem,updateCartItemQuantity} from "@/services/cartApi";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const actionError = ref(null);
  const totalPrice = ref(0);
  const cartCount = ref(0);
  const buyNowItemId = ref(null);

  function setBuyNowItem(cartItemId) {
    buyNowItemId.value = cartItemId;
  }

  function clearBuyNowItem() {
    buyNowItemId.value = null;
  }

  function fetchCartCount() {
    return getCartCount()
      .then((response) => {
        cartCount.value = response.count;
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
        cartItems.value = response.items;
        totalPrice.value = response.totalPrice;
        cartCount.value = response.items.length;
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
        cartItems.value.push(response.item);
        totalPrice.value = response.totalPrice;
        cartCount.value = cartItems.value.length;
        return response;
      })
      .catch((err) => {
        actionError.value = err;
        console.error("Failed to add cart item:", err);
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
          cartItems.value[index].price = response.lineTotal;
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
      .then(() => {
        cartItems.value = cartItems.value.filter(
          (item) => item.cartItemId !== cartItemId,
        );
        cartCount.value = cartItems.value.length;
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
    buyNowItemId,

    fetchCart,
    fetchCartCount,

    increaseQuantity,
    decreaseQuantity,
    changeQuantity,

    removeItem,
    addItem,

    setBuyNowItem,
    clearBuyNowItem,

    clearCartCount,
  };
});