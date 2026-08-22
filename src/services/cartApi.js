import { apiRequest } from "./api";

export function getCart(){
    return apiRequest("/api/cart")
}