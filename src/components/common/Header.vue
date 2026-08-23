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
      <div v-if="authStore.isAuthenticated" class="profile-dropdown-wrapper">
        <router-link to="/profile" class="profile-link" title="User Profile">
          <div class="avatar-circle">
            {{ userStore.userInitial }}
          </div>
        </router-link>

        <div class="dropdown-menu">
          <router-link to="/profile?tab=details" class="dropdown-item">
            Profile Information
          </router-link>
          <router-link to="/profile?tab=addresses" class="dropdown-item">
            Manage Addresses
          </router-link>
          <router-link to="/profile?tab=orders" class="dropdown-item">
            Order History
          </router-link>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-action" @click="handleLogout">
            Sign Out
          </button>
        </div>
      </div>

      <router-link v-else to="/login">
        <BaseButton text="Sign In" />
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
import BaseButton from "./BaseButton.vue";
import { useAuthStore } from "../../stores/authStore.js";
import { useUserStore } from "@/stores/userStore.js";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const handleLogout = () => {
  authStore.logout?.();
  router.push("/login");
};
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

.profile-dropdown-wrapper {
  position: relative;
  display: inline-block;
  padding-bottom: 4px;
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
  cursor: pointer;
}

.avatar-circle:hover {
  background-color: #1d4ed8;
}

/* Dropdown Menu Styles */
.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 180px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0;
  z-index: 50;
}

/* Show dropdown on parent hover */
.profile-dropdown-wrapper:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dropdown-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.35rem 0;
}

.dropdown-item.logout-action {
  color: #dc2626;
}

.dropdown-item.logout-action:hover {
  background-color: #fef2f2;
}
</style>
