import { placeOrder, validateCart } from "@/services/checkoutApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheckoutStore=defineStore('checkout',()=>{

    const checkoutItems=ref([])
     const subtotal=ref(0);
     const loading=ref(false);

     const placingOrder=ref(false);
     const error=ref(null)
     const stockErrors=ref([])

     const order = ref(null);

     async function validateCartBeforeCheckout(){
    loading.value = true;
    error.value = null;
    stockErrors.value = [];

    try {
        const response=await validateCart();
        checkoutItems.value=response.items;
        subtotal.value=response.subtotal;
        return true;
    } catch (err) {
        if(err.response?.unavailableItems){
             stockErrors.value = err.response.unavailableItems;
        }else {
        error.value = "Some products are no longer available.";
      }
      return false;
    }finally {

      loading.value = false;

    }
     }

     async function createOrder(orderData) {

        placingOrder.value=true;
        error.value=null;

        try {
            const response=await placeOrder(orderData);
            order.value=response;

    return response;
        } catch (err) {
             error.value = err.message || "Unable to place order";
           throw err;
        }
        finally {
            placingOrder.value = false;
    }  
     }

  function clearCheckout() {

    checkoutItems.value = [];
    subtotal.value = 0;
    error.value = null;
    stockErrors.value = [];
    order.value = null;

  }

  return {checkoutItems,subtotal,loading,placingOrder,error,stockErrors,order,validateCartBeforeCheckout,createOrder,clearCheckout,
  };
})