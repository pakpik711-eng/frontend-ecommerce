<template>
  <div class="cart-summary">
    <h2>Order Summary</h2>
    <div class="summary-row">
        <span>Subtotal</span>
        <span>{{total.toLocaleString("en-IN")}}</span>
    </div>
    <button>
      Buy Now
    </button>
  </div>
</template>

<script setup>

defineProps({
    total:{
        type:Number,
        required:true
    }
})
</script>

<style>

</style>