<template>
  <h1>Search Results for {{ searchStore.searchQuery }}</h1>

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
<style></style>
