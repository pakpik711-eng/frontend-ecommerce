<template>
  <Header />
  <h1>List Of Products</h1>
  <ProductGrid :products="data" />
</template>

<script setup>
import Header from "@/components/common/Header.vue";
import ProductGrid from "@/components/products/ProductGrid.vue";
import { useInfinitePagination } from "@/composables/ useInfinitePagination";
import { getProducts } from "@/services/productApi";

const {data,loading,hasMore,error,scrollTrigger}=useInfinitePagination(getProducts,10)


</script>



<style></style>
