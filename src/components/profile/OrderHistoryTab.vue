<template>
  <div class="tab-content">
    <h3>Order History</h3>

    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <div v-if="isLoading && orders.length === 0" class="empty-state">
      Loading orders...
    </div>

    <div v-else-if="!isLoading && orders.length === 0" class="empty-state">
      No orders placed yet.
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id"> Order #{{ order.id }} </span>

            <span class="order-date">
              {{ formatDate(order.createdAt) }}
            </span>
          </div>

          <div class="header-right">
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ formatStatus(order.status) }}
            </span>

            <button
              v-if="isCancellable(order.status)"
              class="cancel-btn"
              :disabled="cancellingId === order.id"
              @click="handleCancel(order.id)"
            >
              {{ cancellingId === order.id ? "Cancelling..." : "Cancel Order" }}
            </button>
          </div>
        </div>

        <div v-if="order.shippingAddress" class="shipping-address">
          <strong>Delivery Address</strong>

          <p>
            {{ order.shippingAddress.addressLine1 }}
          </p>

          <p v-if="order.shippingAddress.addressLine2">
            {{ order.shippingAddress.addressLine2 }}
          </p>

          <p>
            {{ order.shippingAddress.city }},
            {{ order.shippingAddress.state }}
          </p>

          <p>
            {{ order.shippingAddress.country }}
            -
            {{ order.shippingAddress.pincode }}
          </p>
        </div>

        <div class="order-body">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="order-item-wrapper"
          >
            <router-link
              :to="`/product/details/${item.productId}/${item.variantId}?m_id=${item.merchantId}`"
              class="order-item-link"
            >
              <div class="item-left">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.productName"
                  class="item-thumbnail"
                />

                <div v-else class="item-thumbnail placeholder-image">
                  No Image
                </div>

                <div class="item-info">
                  <span class="item-name">
                    {{ item.productName }}
                  </span>

                  <span class="item-qty"> Qty: {{ item.quantity }} </span>
                </div>
              </div>

              <div class="item-price-section">
                <span class="item-price">
                  {{ formatCurrency(item.unitPrice) }}
                </span>

                <span class="item-total">
                  {{ formatCurrency(item.lineTotal) }}
                </span>
              </div>
            </router-link>

            <div v-if="isDelivered(order.status)" class="review-action-bar">
              <router-link
                :to="{
                  path: `/review/${item.productId}/${item.variantId}/${item.merchantId}`,
                  query: { name: item.productName, thumbnail: item.imageUrl },
                }"
                class="review-btn"
              >
                <span class="star-icon"> ★ </span>
                Rate & Review Product
              </router-link>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <span>Total</span>

          <strong>
            {{ formatCurrency(order.totalPrice) }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchOrders, cancelOrder } from "@/services/checkoutApi";

const orders = ref([]);
const isLoading = ref(false);
const error = ref("");
const cancellingId = ref(null);

const loadOrders = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const data = await fetchOrders();
    orders.value = data;
  } catch (err) {
    error.value = err.message || "Failed to load orders";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadOrders);

const handleCancel = async (orderId) => {
  if (!confirm("Are you sure you want to cancel this order?")) {
    return;
  }

  error.value = "";
  cancellingId.value = orderId;

  try {
    const cancelledOrder = await cancelOrder(orderId);

    const index = orders.value.findIndex((order) => order.id === orderId);

    if (index !== -1) {
      orders.value[index] = cancelledOrder;
    }
  } catch (err) {
    error.value = err.message || "Failed to cancel order";
  } finally {
    cancellingId.value = null;
  }
};

const formatCurrency = (value) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "₹0.00";
  }

  return `₹${amount.toFixed(2)}`;
};

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "";
  }

  return status
    .toLowerCase()
    .replace(/\_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClass = (status) => {
  if (!status) {
    return "";
  }

  return status.toLowerCase().replace(/\_/g, "-");
};

const isDelivered = (status) => {
  return status === "DELIVERED";
};

const isCancellable = (status) => {
  return status === "CREATED";
};
</script>

<style scoped>
h3 {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  color: #111827;
}

.error-msg {
  margin-bottom: 1rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid #fecaca;
  border-radius: 6px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.8rem;
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
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
  font-size: 0.8rem;
  margin-right: 0.75rem;
  word-break: break-all;
}

.order-date {
  font-size: 0.78rem;
  color: #6b7280;
}

.order-status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 12px;
  background: #f3f4f6;
  color: #374151;
}

.order-status.created {
  background: #dbeafe;
  color: #2563eb;
}

.order-status.delivered {
  background: #dcfce7;
  color: #15803d;
}

.order-status.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.order-status.processing {
  background: #fef3c7;
  color: #b45309;
}

.cancel-btn {
  background: none;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #fef2f2;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shipping-address {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.shipping-address strong {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
  color: #111827;
}

.shipping-address p {
  margin: 0.1rem 0;
  font-size: 0.78rem;
  color: #6b7280;
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
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  padding: 0.25rem 0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.item-thumbnail {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #f3f4f6;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  color: #9ca3af;
  text-align: center;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-item-link:hover .item-name {
  color: #2563eb;
}

.item-qty {
  font-size: 0.78rem;
  color: #6b7280;
}

.item-price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  flex-shrink: 0;
}

.item-price {
  font-size: 0.78rem;
  color: #6b7280;
}

.item-total {
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
  font-size: 0.95rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .order-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .order-item-link {
    align-items: flex-start;
  }

  .item-price-section {
    align-items: flex-end;
  }
}
</style>
