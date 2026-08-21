import { apiRequest } from "./api";


const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    name: "iPhone 15 128GB",
    price: 69999,
    rating: 4.5,
    merchantCount: 5
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b5a",
    name: "Samsung Galaxy S24",
    price: 74999,
    rating: 4.4,
    merchantCount: 7
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
    name: "MacBook Air M3",
    price: 99999,
    rating: 4.8,
    merchantCount: 4
  }
];

export function getProducts(page,size) {
//  `/api/products?page=${page}&size=${size}`
return products;
} 

export function getProductById(id) {
  return apiRequest(`/api/products/${id}`);
}