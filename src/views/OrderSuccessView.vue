<template>
  <main class="success">
    <h1>🎉 Order Placed Successfully!</h1>
    <p>
      Thank you for your order.
    </p>
    <p>
      Order ID:
      <strong>{{ route.query.orderId }}</strong>
    </p>
    <button @click="goHome">
      Continue Shopping
    </button>
  </main>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router';

const router=useRouter();
const route=useRoute();
function goHome() {
  router.push("/");
}
</script>

<style>

</style>