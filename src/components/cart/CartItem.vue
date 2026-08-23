<template>
  <div class="cart-item">

<img :src="item.productImage" :alt="item.productTitle">

<div class="product-info">
    <h3>{{ item.productTitle}}</h3>
    <p>Seller : {{ item.sellerName }}</p>
    <p>Price : {{ item.price.toLocaleString("en-IN")}}</p>
    <div class="quantity-control">
       <button :disabled="item.quantity <= 1"  @click="decreaseQuantity" >-</button>
       <span>{{ item.quantity }}</span>
       <button :disabled="item.availableStock<=item.quantity" @click="increaseQuantity">+</button>
    </div>
        <p>Total: ₹{{ item.totalPrice.toLocaleString("en-IN") }}</p>
        <p v-if="item.quantity>=item.availableStock"> Only {{ item.availableStock }} available</p>
        <button @click="removeItem">Remove</button>
</div>

  </div>
</template>

<script setup>
const props=defineProps({
    item:{
   type:Object,
   required:true
    }
})
const emit = defineEmits([ "increase", "decrease", "remove"]);

function increaseQuantity(){
  emit('increase',props.item.cartItemId)
}
function decreaseQuantity(){
  emit('decrease',props.item.cartItemId);
}
function removeItem(){
  emit('remove',props.item.cartItemId);
}
</script>
<style scoped>

</style>