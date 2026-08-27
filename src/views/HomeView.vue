<!-- HomeView.vue -->
<template>
  <h3 class="page-title">Discover Products</h3>
  <ProductGrid :products="products" />
  <div ref="scrollTrigger"></div>
</template>

<script setup>
import ProductGrid from "@/components/products/ProductGrid.vue";
import { useInfinitePagination } from "@/composables/useInfinitePagination";
import { getProducts } from "@/services/productApi";
import { onMounted, ref } from "vue";

const products = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const error = ref(null);
const page = ref(0);
const size = 10;

function loadMore() {
  if (loading.value || !hasMore.value) {
    return Promise.resolve();
  }
  loading.value = true;
  error.value = null;

  return getProducts(page.value, size)
    .then((response) => {
      products.value.push(...response.content);

      if (page.value >= response.totalPages - 1) {
        hasMore.value = false;
      } else {
        page.value++;
      }
    })
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loading.value = false;
    });
}

const { scrollTrigger } = useInfinitePagination(loadMore);

onMounted(() => {
  loadMore();
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
