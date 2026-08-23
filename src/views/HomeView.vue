<template>
  <h1>List Of Products</h1>
  <ProductGrid :products="productStore.products" />
  <div ref="scrollTrigger"></div>
</template>

<script setup>
import ProductGrid from "@/components/products/ProductGrid.vue";
import { useInfinitePagination } from "@/composables/ useInfinitePagination";

import { useProductStore } from "@/stores/productStore";
import { onMounted } from "vue";

const productStore = useProductStore();
const { scrollTrigger } = useInfinitePagination(productStore.loadMore);

onMounted(() => {
  productStore.loadMore();
});
</script>
<style></style>
