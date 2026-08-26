<template>
  <h3 class="page-title">Results for {{ searchStore.searchQuery }}</h3>

  <ProductGrid :products="searchStore.products" />
  <SearchPagination
    :current-page="searchStore.currentPage"
    :total-pages="searchStore.totalPages"
    @page-change="handleSearch"
  />
</template>

<script setup>
import Header from "@/components/common/Header.vue";
import ProductGrid from "@/components/products/ProductGrid.vue";
import SearchPagination from "@/components/products/SearchPagination.vue";
import { useSearchStore } from "@/stores/searchStore";
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const searchStore = useSearchStore();

function handleSearch(page) {
  searchStore.search(route.query.q, page);
}
watch(
  () => route.query.q,(newQuery) => {
    if (newQuery) {
      searchStore.search(newQuery, 0);
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.page-title {
  max-width: 1200px;
  margin: 24px auto 20px;
  padding: 0 24px;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-main, #14151a);
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.15rem;
    padding: 0 16px;
  }
}
</style>