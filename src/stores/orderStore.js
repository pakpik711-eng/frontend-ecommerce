import { defineStore } from "pinia";
import { ref } from "vue";
import { orderApi } from "@/services/orderApi";

export const useOrderStore = defineStore("order", () => {
  const orders = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function loadOrders() {
    isLoading.value = true;
    error.value = null;
    try {
      orders.value = await orderApi.fetchOrders();
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
      const updatedOrder = await orderApi.cancelOrder(id);
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

  return {
    orders,
    isLoading,
    error,
    loadOrders,
    cancelOrder,
  };
});
