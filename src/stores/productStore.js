import { getProductDetail, getProducts, getProductVariant } from "@/services/productApi";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProductStore = defineStore("product", () => {
  const products = ref([]);

  const loading = ref(false);
  const hasMore = ref(true);
  const error = ref(null);

  const page = ref(0);
  const size = ref(10);




   const currentProduct =ref(null);
      const selectedVariant =ref(null);
      const merchants =ref([]);
      const selectedMerchant =ref(null);



   async function loadProduct(productId,merchantId=null){

    loading.value=true
    error.value=null;

    try {
        
       const response=await getProductDetail(productId);
       currentProduct.value={
        productId:response.productId,
        name:response.name,
        description:response.description,
        thumbnail:response.thumbnail,
        attributes:response.attributes
       }

       selectedVariant.value=response.selectedVariant;
       merchants.value=response.selectedVariant?.merchants||[];

       if(merchantId){
        const merchant=merchants.value.find((item)=> String(item.merchantId)===String(merchantId))
        if(merchant){
            selectedMerchant.value=merchant;
        }else{
         selectedMerchant.value = merchants.value[0] || null;
        }
       }else{
          selectedMerchant.value = merchants.value[0] || null;
       }
       return response;


    } catch (err) {
         error.value =err.message || "Failed to load product";
          throw err;
    }finally {
          loading.value = false;
        }
   }



   async function changeVariant(productId,attributes){
        loading.value = true;
        error.value = null;

        try {
            
              const response = await getProductVariant(productId, attributes);
              selectedVariant.value=response;
              merchants.value=response.merchants||[]

              selectedMerchant.value=merchants.value[0] || null;
              return response;

        } catch (err) {
            error.value = err.message || "Failed to load variant";
          throw err;
        }finally {
              loading.value = false;
        }
   }

      function selectMerchant(merchant){
        selectedMerchant.value =merchant;
      }

        function resetProduct() {
        currentProduct.value =null;
        selectedVariant.value =null;
        merchants.value =[];
        selectedMerchant.value =null;
        loading.value =false;
        error.value =null;
      }





  async function loadMore() {
    if (loading.value || !hasMore.value) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await getProducts(page.value, size.value);
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
    }


    function resetProduct(){
            products.value=[];
            page.value=0;
            hasMore.value=true;
            error.value = null;
        }

     return {products,currentProduct,page,size,loading,hasMore,error,loadMore,resetProduct,
        currentProduct,
        selectedVariant,
        merchants,
        selectedMerchant,
        loading,
        error,
        loadProduct,
        changeVariant,
        selectMerchant,
        
     }
})

