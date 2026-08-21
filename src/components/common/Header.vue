<template>
  <div class="header">
    <div class="logo">
      <h1>Logo</h1>
    </div>

    <div class="search-bar">
      <SearchBar />
    </div>

    <nav class="nav-links">
      <router-link to="/" class="nav-link"> Home </router-link>
      <router-link to="/login" class="nav-link"> Login </router-link>

      <router-link to="/cart" class="nav-link"> Cart </router-link>
    </nav>
  </div>
</template>

<script setup>
import SearchBar from "./SearchBar.vue";
</script>
<style></style>
