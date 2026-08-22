import { searchProducts } from "@/services/searchApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore=defineStore('search',()=>{

const products=ref([])
const loading =ref(false)
const error=ref(null)

const currentPage=ref(0);
const totalPages=ref(0);

const searchQuery=ref('');

async function search(query,page=0){
     if (!query?.trim()) {
    return;
  }
     loading.value = true;
    error.value = null;
    searchQuery.value = query;
    try {
        
        const response=await searchProducts(query,page,10)
        products.value=response.content;
        currentPage.value=response.number;
        totalPages.value=response.totalPages;

    } catch (err) {
     error.value = "Failed to search products";        
    }finally {
      loading.value = false;
    }
}

return {products,loading,error, currentPage,totalPages,searchQuery, search}



})