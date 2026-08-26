<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8H18L17.2 19.2C17.14 20.02 16.46 20.66 15.64 20.66H8.36C7.54 20.66 6.86 20.02 6.8 19.2L6 8Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="brand-name">Buy<span class="brand-accent">Ease</span></span>
      </RouterLink>
    </div>

    <div class="nav-center">
      <SearchBar />
    </div>

    <div class="nav-right">
      <template v-if="authStore.isAuthenticated">
    
        <router-link to="/cart" class="cart-link" title="Shopping Cart">
          <div class="cart-icon-wrapper">
            <svg
              class="cart-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="19" cy="20" r="1" />
              <path
                d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"
              />
            </svg>

            <span v-if="cartStore.cartCount > 0" class="cart-badge">
              {{ cartStore.cartCount }}
            </span>
          </div>
        </router-link>

        <!-- Profile -->
        <div class="profile-dropdown-wrapper">
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
      </template>

      <router-link v-else to="/login">
        <BaseButton text="Sign In" />
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import SearchBar from "./SearchBar.vue";
import BaseButton from "./BaseButton.vue";

import { useAuthStore } from "../../stores/authStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useCartStore } from "@/stores/cartStore.js";

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();
const cartStore = useCartStore();

const handleLogout = async () => {
  await authStore.logout();

  cartStore.clearCartCount();

  await router.push("/login");
};

async function loadCartCount() {
  if (!authStore.isAuthenticated) {
    cartStore.clearCartCount();
    return;
  }

  await cartStore.fetchCartCount();
}

onMounted(() => {
  loadCartCount();
});

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      loadCartCount();
    } else {
      cartStore.clearCartCount();
    }
  },
);
</script>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 32px;
  background-color: var(--color-surface, #ffffff);
  border-bottom: 1px solid var(--color-border, #e3e3e6);
  position: sticky;
  top: 0;
  z-index: 40;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--color-primary, #111214);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-main, #14151a);
}

.brand-accent {
  color: var(--color-text-muted, #6b7280);
  font-weight: 400;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-right a {
  text-decoration: none;
}

.cart-link {
  color: var(--color-text-main, #14151a);
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cart-icon-wrapper:hover {
  background-color: var(--color-bg, #f7f7f8);
}

.cart-icon {
  width: 22px;
  height: 22px;
  color: var(--color-text-main, #14151a);
  transition: color 0.2s ease;
}

.cart-icon-wrapper:hover .cart-icon {
  color: var(--color-primary, #111214);
}

.cart-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background-color: var(--color-danger, #e0313a);
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-sizing: border-box;
}

.profile-dropdown-wrapper {
  position: relative;
  display: inline-block;
  padding-bottom: 14px;
}

.profile-link {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  background-color: var(--color-primary, #111214);
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
  background-color: var(--color-primary-hover, #000000);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 190px;
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e3e3e6);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  z-index: 50;
  margin-top: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s;
}

.profile-dropdown-wrapper:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: 0s;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.65rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
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
  background-color: var(--color-primary-light, #f0f0f1);
  color: var(--color-primary, #111214);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border-light, #eeeeef);
  margin: 0.35rem 0;
}

.dropdown-item.logout-action {
  color: var(--color-danger, #e0313a);
}

.dropdown-item.logout-action:hover {
  background-color: var(--color-danger-light, #fdedee);
}

@media (max-width: 720px) {
  .navbar {
    padding: 12px 16px;
    gap: 12px;
  }

  .nav-center {
    order: 3;
    flex-basis: 100%;
    margin: 0;
  }

  .brand-name {
    font-size: 1.15rem;
  }
}

@media (max-width: 400px) {
  .brand-name {
    display: none;
  }
}
</style>