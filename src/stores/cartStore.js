import { addCartItem, getCart, removeItemCartItem, updateCartItemQuantity } from "@/services/cartApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartStore=defineStore('cart',()=>{

    const cartItems=ref([])
    const loading=ref(false)
    const error=ref(null)

    const totalPrice=ref(0);

    async function fetchCart() {
      loading.value=true;
      error.value=null;
      
      try {
          const response=await getCart();
          cartItems.value=response.items;  
          totalPrice.value = response.totalPrice;
     
      } catch (err) {
        error.value="Failed to Load cart"
      }
      finally{
        loading.value=false;
      }
    }


    async function addItem(item){
     loading.value = true;
     error.value = null;

     try {
      const response= await addCartItem(item);
      cartItems.value.push(response.item);
      totalPrice.value = response.totalPrice;
      return response;
      
     } catch (err) {
      error.value=err;
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
         cartItems.value[index].quantity =updatedItem.item.quantity;
         cartItems.value[index].price =updatedItem.item.price;
     }
      totalPrice.value =updatedItem.totalPrice;
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
   
  return {cartItems,loading,error,totalPrice,fetchCart,increaseQuantity,decreaseQuantity,removeItem,addItem};

})