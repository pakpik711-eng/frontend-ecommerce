<template>
  <div class="checkout-summary">
     <h2>Order Summary</h2>
    <div class="summary-row">
      <span>Subtotal</span>
      <span> ₹{{ (subtotal || 0).toLocaleString("en-IN") }} </span>
    </div>
    <div class="summary-row">
      <strong>Total</strong>
      <strong> ₹{{ (subtotal || 0).toLocaleString("en-IN") }}</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subtotal: {
    type: Number,
    required: true,
  },
});

</script>
<style scoped>
.checkout-summary {
  background: var(--color-surface);
  border: .5px solid var(--color-text-main);
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
  font-size: 0.9rem;
  color: var(--color-text-muted);
  padding: 0.5rem 0;
}

.summary-row:last-child {
  border-top: 1px solid var(--color-border-light);
  margin-top: 0.4rem;
  padding-top: 0.9rem;
  color: var(--color-text-main);
  font-size: 1rem;
}
</style>