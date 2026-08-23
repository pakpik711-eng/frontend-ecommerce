<template>
  <div class="cart-summary">
    <h2>Order Summary</h2>
    <div class="summary-row">
        <span>Subtotal</span>
        <span>{{total.toLocaleString("en-IN")}}</span>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
   <button
      :disabled="loading"
      @click="handleBuyNow"
    > {{ loading ? "Checking..." : "Buy Now" }}
     </button>
  </div>
</template>

<script setup>
import { useCheckoutStore } from '@/stores/checkoutStore';
import { useRouter } from 'vue-router';


defineProps({
    total:{
        type:Number,
        required:true
    }
})

const router=useRouter();
const checkoutStore=useCheckoutStore();

async function handleBuyNow(){
  const valid=await checkoutStore.validateCartBeforeCheckout();
  if(!valid){
    return ;
  }
   router.push("/checkout");
}

</script>

<style>

</style>