<template>
  <div class="cart-item">

<img :src="item.productImage" :alt="item.productTitle">

<div>
    <h3>{{ item.productTitle}}</h3>
    <p>Seller : {{ item.sellerName }}</p>
    <p>Price : {{ item.price.toLocaleString("en-IN")}}</p>
    <p>Quantity : {{ item.quantity  }}</p>
    <p>  Total: ₹{{ item.totalPrice.toLocaleString("en-IN") }}</p>
</div>

  </div>
</template>

<script setup>
defineProps({
    item:{
   type:Object,
   required:true
    }
})
</script>
<style>

</style>