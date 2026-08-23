<template>
  <Header />
  <main>
    <p v-if="cartStore.cartItems.length === 0"></p>

    <template v-else>
      <CartItem
        v-for="item in cartStore.cartItems"
        :key="item.cartItemId"
        :item="item"
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

<style></style>
