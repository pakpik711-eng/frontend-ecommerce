import { placeOrder, fetchOrders, withdrawOrder } from "@/services/checkoutApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheckoutStore = defineStore("checkout", () => {
  const checkoutItems = ref([]);
  const subtotal = ref(0);
  const loading = ref(false);

  const placingOrder = ref(false);
  const error = ref(null);
  const stockErrors = ref([]);

  const order = ref(null);
  const orders = ref([]);
  const isLoading = ref(false);

  async function loadOrders() {
    isLoading.value = true;
    error.value = null;
    try {
      orders.value = await fetchOrders();
    } catch (err) {
      error.value = err.message || "Failed to load orders";
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelOrder(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedOrder = await withdrawOrder(id);
      const index = orders.value.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }
    } catch (err) {
      error.value = err.message || "Failed to cancel order";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createOrder(orderData) {
    placingOrder.value = true;
    error.value = null;

    try {
      const response = await placeOrder(orderData);
      order.value = response;

      return response;
    } catch (err) {
      error.value = err.message || "Unable to place order";
      throw err;
    } finally {
      placingOrder.value = false;
    }
  }

  function clearCheckout() {
    checkoutItems.value = [];
    subtotal.value = 0;
    error.value = null;
    stockErrors.value = [];
    order.value = null;
  }

  return {
    checkoutItems,
    subtotal,
    loading,
    placingOrder,
    error,
    stockErrors,
    order,
    createOrder,
    clearCheckout,
    orders,
    isLoading,
    loadOrders,
    cancelOrder,
  };
});
