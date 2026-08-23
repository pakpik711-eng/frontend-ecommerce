import { apiRequest } from "./api";

export function getCart(){
    return apiRequest("/api/cart")
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