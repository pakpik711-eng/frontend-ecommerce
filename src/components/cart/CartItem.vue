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
.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cart-item img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 20px;
}

.product-info p {
  margin: 8px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 15px 0;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
}

.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 25px;
  text-align: center;
}

.product-info > button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>