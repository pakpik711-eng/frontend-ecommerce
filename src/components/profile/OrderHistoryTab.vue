<template>
  <div class="tab-content">
    <h3>Order History</h3>

    <div v-if="orderStore.isLoading && orders.length === 0" class="empty-state">
      Loading orders...
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      No orders placed yet.
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">Order #{{ order.id }}</span>
            <span class="order-date">{{ order.date }}</span>
          </div>
          <div class="header-right">
            <span class="order-status" :class="order.status.toLowerCase()">
              {{ order.status }}
            </span>
            <button
              v-if="
                order.status !== 'Delivered' && order.status !== 'Cancelled'
              "
              class="cancel-btn"
              :disabled="orderStore.isLoading"
              @click="handleCancel(order.id)"
            >
              Cancel Order
            </button>
          </div>
        </div>

        <div class="order-body">
          <div
            v-for="(item, idx) in order.items"
            :key="idx"
            class="order-item-wrapper"
          >
            <router-link
              :to="`/product/details/${item.productId}/${item.variantId}?m_id=${item.merchantId}`"
              class="order-item-link"
            >
              <div class="item-left">
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="item-thumbnail"
                />
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty">Qty: {{ item.qty }}</span>
                </div>
              </div>
              <span class="item-price">${{ item.price.toFixed(2) }}</span>
            </router-link>

            <div v-if="order.status === 'Delivered'" class="review-action-bar">
              <router-link
                :to="`/review/${item.productId}/${item.variantId}/${item.merchantId}`"
                class="review-btn"
              >
                <span class="star-icon">★</span> Rate & Review Product
              </router-link>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <span>Total</span>
          <strong>${{ order.total.toFixed(2) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);

onMounted(() => {
  orderStore.loadOrders();
});

const handleCancel = async (id) => {
  if (confirm("Are you sure you want to cancel this order?")) {
    try {
      await orderStore.cancelOrder(id);
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    }
  }
};
</script>

<style scoped>
h3 {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  color: #111827;
}

.empty-state {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  padding: 2rem 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.order-id {
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: 0.75rem;
}

.order-date {
  font-size: 0.78rem;
  color: #6b7280;
}

.order-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
}

.order-status.delivered {
  background-color: #dcfce7;
  color: #15803d;
}

.order-status.processing {
  background-color: #fef3c7;
  color: #b45309;
}

.order-status.cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

.cancel-btn {
  background: none;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #fef2f2;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-body {
  padding: 0.5rem 1rem;
}

.order-item-wrapper {
  padding: 0.5rem 0;
}

.order-item-wrapper:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.order-item-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 0.25rem 0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #f3f4f6;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.order-item-link:hover .item-name {
  color: #2563eb;
}

.item-qty {
  font-size: 0.78rem;
  color: #6b7280;
}

.item-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.review-action-bar {
  display: flex;
  align-items: center;
  margin-top: 0.4rem;
  padding-left: 3.75rem;
}

.review-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.review-btn:hover {
  text-decoration: underline;
}

.star-icon {
  color: #2563eb;
  font-size: 0.95rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.9rem;
}
</style>
