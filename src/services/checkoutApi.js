import { apiRequest } from "./api";

export function validateCart(){

    return apiRequest('/api/cart/validate',{
       method:'POST'
    })
}

export function placeOrder(orderData){
    return apiRequest('/api/orders',{
        method:'POST',
        body:JSON.stringify(orderData)
    })
}