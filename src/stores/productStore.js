import { getProducts } from "@/services/productApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProductStore=defineStore('product',()=>{


    const products=ref([])
    const currentProduct=ref(null);

    const loading=ref(false);
    const hasMore=ref(true);
    const error=ref(null);

    const page=ref(0);
    const size=ref(10);

    async function loadMore(){
        if(loading.value || !hasMore.value){
            return;
        }
        loading.value=true;
        error.value=null;
        try {
            const response=await getProducts(page.value,size.value);
            products.value.push(...response.content);

            if(page.value>=response.totalPages-1){
                hasMore.value=false;
            }else{
                page.value++;
            }
        } catch (err) {
            error.value=err;
        }finally{
            loading.value=false;
        }
        function resetProduct(){
            products.value=[];
            page.value=0;
            hasMore.value=true;
            error.value = null;
        }
    }
     return {products,currentProduct,page,size,loading,hasMore,error,loadMore,resetProduct}
})

