<template>
  <div class="checkout-summary">
    <h2>Order Summary</h2>
    <div class="summary-row">
      <strong>Total</strong>
      <strong> ₹{{ (total || 0).toLocaleString("en-IN") }}</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({
  total: {
    type: Number,
    required: true,
  },
});
</script>
<style scoped>
.checkout-summary {
  background: var(--color-surface);
  border: 0.5px solid var(--color-text-main);
  border-radius: 4px;
  padding: 1.5rem;
  position: sticky;
  top: 84px;
}

.checkout-summary h2 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: var(--color-text-main);
  padding: 0.5rem 0;
}
</style>
