<template>
  <header class="navbar-wrapper">
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="brand" aria-label="BuyEase Home">
          <span class="brand-mark">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 8H18L17.2 19.2C17.14 20.02 16.46 20.66 15.64 20.66H8.36C7.54 20.66 6.86 20.02 6.8 19.2L6 8Z"
                stroke="white"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8"
                stroke="white"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="brand-name"
            >Buy<span class="brand-accent">Ease</span></span
          >
        </RouterLink>
      </div>

      <div class="nav-center">
        <SearchBar />
      </div>

      <div class="nav-right">
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/cart"
            class="icon-btn cart-link"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <svg
              class="nav-icon"
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
              {{ cartStore.cartCount > 99 ? "99+" : cartStore.cartCount }}
            </span>
          </RouterLink>

          <div
            class="profile-dropdown-wrapper"
            @mouseenter="isMenuOpen = true"
            @mouseleave="isMenuOpen = false"
          >
            <RouterLink to="/profile" class="profile-link" title="User Profile">
              <div class="avatar-circle">
                {{ userStore.userInitial || "U" }}
              </div>
            </RouterLink>

            <Transition name="dropdown-fade">
              <div v-show="isMenuOpen" class="dropdown-menu">
                <RouterLink
                  to="/profile?tab=details"
                  class="dropdown-item"
                  @click="isMenuOpen = false"
                >
                  Profile Information
                </RouterLink>
                <RouterLink
                  to="/profile?tab=addresses"
                  class="dropdown-item"
                  @click="isMenuOpen = false"
                >
                  Manage Addresses
                </RouterLink>
                <RouterLink
                  to="/profile?tab=orders"
                  class="dropdown-item"
                  @click="isMenuOpen = false"
                >
                  Order History
                </RouterLink>
                <div class="dropdown-divider"></div>
                <button
                  class="dropdown-item logout-action"
                  @click="handleLogout"
                >
                  Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </template>

        <template v-else>
          <RouterLink to="/login" class="auth-link">
            <BaseButton text="Sign In" />
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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

const isMenuOpen = ref(false);

const handleLogout = async () => {
  isMenuOpen.value = false;
  await authStore.logout();
  cartStore.clearCartCount();
  await router.push("/login");
};

async function fetchCartItems() {
  if (!authStore.isAuthenticated) {
    cartStore.clearCartCount();
    return;
  }
  await cartStore.fetchCart();
}

onMounted(() => {
  fetchCartItems();
});

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      cartStore.clearCartCount();
    }
  },
);
</script>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  width: 100%;
}

.navbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  user-select: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm, 10px);
  background: var(--color-primary, #111214);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--color-text-main, #111827);
  white-space: nowrap;
}

.brand-accent {
  color: var(--color-text-muted, #6b7280);
  font-weight: 400;
}

.nav-center {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 540px;
  justify-self: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;
}

.auth-link {
  text-decoration: none;
}

.icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-text-main, #111827);
  background: transparent;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  text-decoration: none;
}

.icon-btn:hover {
  background-color: var(--color-bg-hover, #f3f4f6);
}

.icon-btn:active {
  transform: scale(0.95);
}

.nav-icon {
  width: 22px;
  height: 22px;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background-color: var(--color-danger, #ef4444);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 0 0 2px #ffffff;
  pointer-events: none;
}

.profile-dropdown-wrapper {
  position: relative;
  padding-bottom: 8px;
  margin-bottom: -8px;
}

.profile-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--color-primary, #111214);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.profile-dropdown-wrapper:hover .avatar-circle {
  background-color: var(--color-primary-hover, #2d2f34);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 210px;
  background-color: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 12px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
  padding: 6px;
  z-index: 100;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main, #374151);
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.dropdown-item:hover {
  background-color: var(--color-bg-hover, #f3f4f6);
  color: var(--color-text-main, #111827);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border, #e5e7eb);
  margin: 6px 0;
}

.dropdown-item.logout-action {
  color: var(--color-danger, #ef4444);
}

.dropdown-item.logout-action:hover {
  background-color: #fef2f2;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 868px) {
  .navbar {
    grid-template-columns: auto auto;
    row-gap: 12px;
    padding: 10px 16px;
  }

  .nav-center {
    grid-column: 1 / -1;
    order: 3;
    max-width: 100%;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 1.1rem;
  }

  .nav-right {
    gap: 8px;
  }
}
</style>
