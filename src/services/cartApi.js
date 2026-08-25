import { apiRequest } from "./api";

export function getCart(){
    return apiRequest("/api/cart")
}

export function addCartItem(cartItems){
    return apiRequest("/api/cart/items",{
        method:"POST",
        body:JSON.stringify(cartItems)
    })
}

export function updateCartItemQuantity(cartItemId,quantity){
    return apiRequest(`/api/cart/items/${cartItemId}`,
        {
            method:"PATCH",
            body:JSON.stringify({quantity})
        }
    )
}

export function removeItemCartItem(cartItemId){
    return apiRequest(`/api/cart/items/${cartItemId}`,{
        method:'DELETE'
    });
}