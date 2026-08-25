<template>
  <main>
    <p v-if="cartStore.loading">Loading cart...</p>
    <p v-else-if="cartStore.cartItems.length === 0">No items in cart</p>

    <template v-else>
      <p v-if="cartStore.error" class="error">{{ cartStore.error }}</p>
      <CartItem
        v-for="item in cartStore.cartItems"
        :key="item.cartItemId"
        :item="item"
        @increase="cartStore.increaseQuantity"
        @decrease="cartStore.decreaseQuantity"
        @remove="cartStore.removeItem"
      />
      <CartSummary :total="cartStore.totalPrice" />
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.cart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
