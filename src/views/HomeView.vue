<template>
  <h3 class="page-title">Discover Products</h3>
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

<style scoped>
.page-title {
  max-width: 1200px;
  margin: 24px auto 20px;
  padding: 0 24px;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-text-main);
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.3rem;
    padding: 0 16px;
  }
}
</style>