<template>
  <div class="cart-summary">
    <h2>Order Summary</h2>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹{{ (total || 0).toLocaleString("en-IN") }}</span>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="actionError">{{ actionError }}</div>
    <button :disabled="loading" @click="handleBuyNow">
      {{ loading ? "Checking..." : "Buy Now" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validateCart } from "@/services/cartApi";
import { useCartStore } from "@/stores/cartStore";

defineProps({
  total: {
    type: Number,
    required: true,
  },
});

const router = useRouter();
const loading = ref(false);
const actionError = ref(null);
const cartStore = useCartStore();

function handleBuyNow() {
  loading.value = true;
  actionError.value = null;

  return validateCart()
    .then(() => {
      cartStore.authorizeCheckoutNavigation();
      router.push("/checkout");
    })
    .catch((err) => {
      actionError.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped>
.cart-summary {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 84px;
}

.cart-summary h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 16px;
}

.error {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.cart-summary button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cart-summary button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.cart-summary button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
