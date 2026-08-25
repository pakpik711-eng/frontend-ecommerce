import {
  addCartItem,
  getCart,
  getCartCount,
  removeItemCartItem,
  updateCartItemQuantity,
  validateCart,
} from "@/services/cartApi";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const totalPrice = ref(0);
  const cartCount = ref(0);

  async function fetchCartCount() {
    try {
      const response = await getCartCount();
      cartCount.value = response.count;
    } catch (err) {
      cartCount.value = 0;
      console.error("Failed to fetch cart count:", err);
    }
  }

  async function fetchCart() {
    loading.value = true;
    error.value = null;

    try {
      const response = await getCart();

      console.log(response);

      cartItems.value = response.items;
      totalPrice.value = response.totalPrice;
      cartCount.value = response.items.length;
    } catch (err) {
      error.value = "Failed to Load cart";
      console.error("Failed to fetch cart:", err);
    } finally {
      loading.value = false;
    }
  }

  async function addItem(item) {
    loading.value = true;
    error.value = null;

    try {
      const response = await addCartItem(item);

      cartItems.value.push(response.item);
      totalPrice.value = response.totalPrice;

      // One new cart item
      cartCount.value += 1;

      return response;
    } catch (err) {
      error.value = err;
      console.error("Failed to add cart item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function increaseQuantity(cartItemId) {
    const item = cartItems.value.find((item) => item.cartItemId === cartItemId);

    if (!item) return;

    if (item.quantity >= item.availableStock) {
      error.value = "Out of stock";
      return;
    }

    await changeQuantity(cartItemId, item.quantity + 1);
  }

  async function decreaseQuantity(cartItemId) {
    const item = cartItems.value.find((item) => item.cartItemId === cartItemId);

    if (!item) return;

    if (item.quantity <= 1) {
      return;
    }

    await changeQuantity(cartItemId, item.quantity - 1);
  }

  async function changeQuantity(cartItemId, quantity) {
    try {
      const response = await updateCartItemQuantity(cartItemId, quantity);

      const index = cartItems.value.findIndex(
        (item) => item.cartItemId === cartItemId,
      );

      if (index !== -1) {
        cartItems.value[index].quantity = response.item.quantity;
        cartItems.value[index].price = response.item.price;
      }

      totalPrice.value = response.totalPrice;
    } catch (err) {
      error.value = "Unable to update quantity";
      console.error("Unable to update quantity:", err);
      throw err;
    }
  }

  async function removeItem(cartItemId) {
    try {
      await removeItemCartItem(cartItemId);

      cartItems.value = cartItems.value.filter(
        (item) => item.cartItemId !== cartItemId,
      );

      cartCount.value--;
    } catch (err) {
      error.value = "Unable to remove item";
      console.error("Unable to remove item:", err);
      throw err;
    }
  }

  async function validateCartItems() {
    try {
      error.value = null;

      const response = await validateCart();

      return response;
    } catch (err) {
      error.value = "Unable to validate cart";
      console.error("Unable to validate cart:", err);
      throw err;
    }
  }

  function clearCartCount() {
    cartCount.value = 0;
  }

  return {
    cartItems,
    loading,
    error,
    totalPrice,
    cartCount,

    fetchCart,
    fetchCartCount,

    increaseQuantity,
    decreaseQuantity,
    changeQuantity,

    removeItem,
    addItem,

    validateCartItems,

    clearCartCount,
  };
});
