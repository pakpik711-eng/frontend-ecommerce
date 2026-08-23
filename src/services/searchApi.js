import { apiRequest } from "./api";

export function searchProducts(query,page,size){
 return apiRequest(`/api/search/products?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);

}