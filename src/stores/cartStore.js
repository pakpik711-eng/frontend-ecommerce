import { getCart } from "@/services/cartApi";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCartStore=defineStore('cart',()=>{

    const cartItems=ref([])
    const loading=ref(false)
    const error=ref(null)

    const totalPrice=computed(()=>{
        return cartItems.value.reduce((sum,item)=>sum+item.totalPrice,0)
    });

    async function fetchCart() {
      loading.value=true;
      error.value=null;
      
      try {
          const response=await getCart();
          cartItems.value=response.items;       
      } catch (err) {
        error.value="Failed to Load cart"
      }
      finally{
        loading=false;
      }
    }
    return {cartItems,loading,error,totalPrice,fetchCart};

})