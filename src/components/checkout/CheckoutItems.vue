<template>
  

  <div class="checkout-items">
    <h2>Your Products</h2>
    <div v-for="item in items"
    :key="item.cartItemId"
    class="checkout-item"
    >

    <img :src="item.productImage"  :alt="item.productTitle"/>
    <div class="product-info">
           <h3>{{ item.productTitle }}  </h3>
    <p>Seller: {{ item.sellerName }}   </p>
     <p>Price: ₹{{ item.price.toLocaleString("en-IN") }}  </p>
     <p>Quantity: {{ item.quantity }}</p>
    </div>
    <div class="item-total">₹{{ item.totalPrice.toLocaleString("en-IN") }}
      </div>
    </div>
  </div>

</template>

<script setup>

defineProps({
    items:{
        type:Array,
        required:true,
    },
})
</script>

<style>

</style>