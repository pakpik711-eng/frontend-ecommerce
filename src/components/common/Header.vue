<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/"
        ><img src="../../assets/logo.svg" alt="Logo" class="logo"
      /></RouterLink>
    </div>

    <div class="nav-center">
      <SearchBar />
    </div>

    <div class="nav-right">
      <router-link to="/auth">
        <BaseButton text="Sign In" />
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import SearchBar from "./SearchBar.vue";
import BaseButton from "./BaseButton.vue";
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  height: 32px;
  width: auto;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;
}

.nav-right a {
  text-decoration: none;
}
</style>
