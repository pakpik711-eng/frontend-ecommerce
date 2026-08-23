<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/">
        <img src="../../assets/logo.svg" alt="Logo" class="logo" />
      </RouterLink>
    </div>

    <div class="nav-center">
      <SearchBar />
    </div>

    <div class="nav-right">
      <router-link
        v-if="authStore.isAuthenticated"
        to="/profile"
        class="profile-link"
        title="User Profile"
      >
        <div class="avatar-circle">
          {{ userStore.userInitial }}
        </div>
      </router-link>

      <router-link v-else to="/login">
        <BaseButton text="Sign In" />
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import SearchBar from "./SearchBar.vue";
import BaseButton from "./BaseButton.vue";
import { useAuthStore } from "../../stores/authStore.js";
import { useUserStore } from "@/stores/userStore.js";

const authStore = useAuthStore();
const userStore = useUserStore();
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

.profile-link {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.avatar-circle:hover {
  background-color: #1d4ed8;
}
</style>
