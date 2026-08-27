import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SearchResultsView from "@/views/SearchResultsView.vue";
import CartView from "@/views/CartView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import OrderSuccessView from "@/views/OrderSuccessView.vue";
import ReviewView from "@/views/ReviewView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
    meta: { guestOnly: true },
  },

  {
    path: "/search",
    name: "Search",
    component: SearchResultsView,
  },
  {
    path: "/product/:productId",
    name: "ProductDetail",
    component: ProductDetailView,
  },
 
  {
    path: "/product/details/:productId/:variantId",
    name: "ProductDetailWithVariant",
    component: ProductDetailView,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: CheckoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/order-success",
    name: "OrderSuccess",
    component: OrderSuccessView,
    meta: { requiresAuth: true },
  },

  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/review/:p_id/:v_id/:m_id",
    name: "Review",
    component: ReviewView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.authInitialized) await authStore.initializeAuth();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "Login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "Home" };
  }

  return true;
});

export default router;
