<template>
  <div class="checkout-summary">
     <h2>Order Summary</h2>
    <div class="summary-row">
      <span>Subtotal</span>
      <span> ₹{{ subtotal.toLocaleString("en-IN") }} </span>
    </div>
    <div class="summary-row">
      <strong>Total</strong>
      <strong> ₹{{ subtotal.toLocaleString("en-IN") }}</strong>
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

<style>

</style>