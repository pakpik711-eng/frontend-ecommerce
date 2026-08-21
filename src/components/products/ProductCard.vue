<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" />
    <div class="product-info">
      <h2>{{ product.name }}</h2>
      <p class="price">Price : {{ product.price.toLocaleString("en-IN") }}</p>
      <p class="rating">Rating : {{ product.rating }}</p>
      <p class="merchants">{{ product.merchantCount }} sellers</p>
      <button @click="viewProduct">View Product</button>
    </div>
  </div>
</template>
<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
<style></style>
