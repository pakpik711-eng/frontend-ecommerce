<template>
  <Header />
  <main>
      <p v-if="cartStore.loading">
      Loading cart...
    </p>
    <p v-else-if="cartStore.cartItems.length === 0">No items in cart</p>

    <template v-else>
       <p v-if="cartStore.error"  class="error" > {{ cartStore.error }}  </p>
      <CartItem
        v-for="item in cartStore.cartItems"
        :key="item.cartItemId"
        :item="item"
        @increase="cartStore.increaseQuantity"
        @decrease="cartStore.decreaseQuantity"
        @remove="cartStore.removeItem"
      />
      <CartSummary :total="cartStore.totalPrice"/>
     
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
