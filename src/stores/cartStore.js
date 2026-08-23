import { getCart, removeItemCartItem, updateCartItemQuantity } from "@/services/cartApi";
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
        loading.value=false;
      }
    }

async function increaseQuantity(cartItemId){

  const item=cartItems.value.find(item=>item.cartItemId==cartItemId)
  if(!item) return;
 
  if(item.quantity>=item.availableStock){
    error.value="Out of stock";
    return;
  }

  await changeQuantity(cartItemId,item.quantity+1)


}

async function decreaseQuantity(cartItemId){

  const item=cartItems.value.find(item=>item.cartItemId==cartItemId);
  
  if(!item){
    return;
  }

  if(item.quantity<=1){
    return;
  }

  await changeQuantity(cartItemId,item.quantity-1);
}


async function changeQuantity(cartItemId,quantity) {
  
  try {
    
    const updatedItem=await updateCartItemQuantity(cartItemId,quantity);
    const index=cartItems.value.findIndex(item=>item.cartItemId===cartItemId);
     if(index!=-1){
      cartItems.value[index]=updatedItem
     }
  } catch (err) {
     error.value ="Unable to update quantity";
  }
}
async function removeItem(cartItemId) {
  try {
    await removeItemCartItem(cartItemId);
    cartItems.value= cartItems.value.filter(item => item.cartItemId !== cartItemId);
  } catch (err) {
    error.value = "Unable to remove item";
  }
  }
   
  return {cartItems,loading,error,totalPrice,fetchCart,increaseQuantity,decreaseQuantity,removeItem};

})