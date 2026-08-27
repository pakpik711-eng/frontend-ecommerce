<template>
  <div class="checkout-items">
    <h2>Your Products</h2>
    <div v-for="item in items" :key="item.cartItemId" class="checkout-item">
      <img :src="item.productImage" :alt="item.productName" />
      <div class="product-info">
        <h3>{{ item.productName }}</h3>
        <p>Price: ₹{{ (item.unitPrice || 0).toLocaleString("en-IN") }}</p>
        <p>Quantity: {{ item.quantity }}</p>
      </div>
      <div class="item-total">
        ₹{{ (item.lineTotal || 0).toLocaleString("en-IN") }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
<style scoped>
.checkout-items {
  background: var(--color-surface);
  border: 0.5px solid var(--color-text-main);
  border-radius: 4px;
  padding: 1.5rem;
}

.checkout-items h2 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border-light);
}

.checkout-item:last-child {
  border-bottom: none;
}

.checkout-item img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 4px;
  background: var(--color-bg);
}

.product-info {
  flex: 1;
}

.product-info h3 {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.product-info p {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin: 0.1rem 0;
}

.item-total {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-main);
}
</style>
