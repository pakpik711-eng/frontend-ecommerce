import { onMounted, onUnmounted, ref } from "vue"

export function useInfinitePagination(fetFunction,size=10){
    const data=ref([])
    const page=ref(0)
    const loading=ref(false)
    const hasMore = ref(true)
    const error = ref(null)
    const scrollTrigger = ref(null)
    let observer = null

    async function loadMore(){
        if (loading.value || !hasMore.value) {
      return;
    }

     loading.value=true;
     error.value=null
         try{
            const response=await fetFunction(page.value,size);
            const newData=response.content;
            data.value.push(...newData);

            if(page.value>=response.totalPages-1){
                hasMore.value=false;
            }else{
                page.value++;
            }
         }
         catch(err){
            error.value=err;
         }
         finally{
            loading.value=true;
         }
    }

    function setupObserver(){
        observer=new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting){
                loadMore();
            }
        },
        {
        rootMargin: "200px"
      }
    )
    if(scrollTrigger.value){
        observer.observe(scrollTrigger.value);
    }
    }

    onMounted(async ()=>{
        await loadMore();
        setupObserver();
    });

    onUnmounted(()=>{
        if(observer){
            observer.disconnect()
        }
    })

    return {
        data,page,loading,hasMore,error,scrollTrigger,loadMore
    }
}