<template>
  <main class="cart-page">
    <h1 class="page-title">Shopping Cart</h1>
    <p v-if="cartStore.loading" class="status-msg">Loading cart...</p>
    <p v-else-if="cartStore.cartItems.length === 0" class="status-msg">No items in cart</p>

    <template v-else>
      <p v-if="cartStore.error" class="error">{{ cartStore.error }}</p>
      <div class="cart-layout">
        <div class="cart-items">
          <p v-if="cartStore.actionError">{{cartStore.actionError}}</p>
          <CartItem
            v-for="item in cartStore.cartItems"
            :key="item.cartItemId"
            :item="item"
            @increase="cartStore.increaseQuantity"
            @decrease="cartStore.decreaseQuantity"
            @remove="cartStore.removeItem"
          />
        </div>
        <aside>
          <CartSummary :total="cartStore.totalPrice" />
        </aside>
      </div>
    </template>
  </main>
</template>

<script setup>
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import Header from "@/components/common/Header.vue";
import { useCartStore } from "@/stores/cartStore";
import { onMounted } from "vue";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.cart-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 24px 48px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 24px 0 20px;
}

.status-msg {
  color: var(--color-text-muted);
  padding: 2rem 0;
}

.error {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 0.85rem 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding: 8px 16px 32px;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>