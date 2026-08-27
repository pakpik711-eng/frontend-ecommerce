<template>
  <h3 class="page-title">Results for {{ searchQuery }}</h3>

  <div
    v-if="!loading && searchQuery && products.length === 0"
    class="empty-state"
  >
    <svg
      class="empty-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" />
      <line
        x1="16.3"
        y1="16.3"
        x2="21"
        y2="21"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
    <p>No results found for "{{ searchQuery }}"</p>
  </div>

  <ProductGrid v-else :products="products" />
  <SearchPagination
    v-if="totalPages > 1"
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handleSearch"
  />
</template>

<script setup>
import ProductGrid from "@/components/products/ProductGrid.vue";
import SearchPagination from "@/components/products/SearchPagination.vue";
import { searchProducts } from "@/services/searchApi";
import { onMounted, ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();

const products = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(0);
const totalPages = ref(0);
const searchQuery = ref("");

function search(query, page = 0) {
  if (!query?.trim()) {
    return Promise.resolve();
  }
  loading.value = true;
  error.value = null;
  searchQuery.value = query;

  return searchProducts(query, page, 10)
    .then((response) => {
      products.value = response.content;
      currentPage.value = response.page;
      totalPages.value = response.totalPages;
    })
    .catch(() => {
      error.value = "Failed to search products";
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleSearch(page) {
  search(route.query.q, page);
}

onMounted(() => {
  if (route.query.q) {
    search(route.query.q, 0);
  }
});

onBeforeRouteUpdate((to) => {
  if (to.query.q) {
    search(to.query.q, 0);
  }
});
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 64px 24px;
  color: var(--color-text-muted);
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
}

.empty-state p {
  font-size: 0.95rem;
  margin: 0;
}
</style>