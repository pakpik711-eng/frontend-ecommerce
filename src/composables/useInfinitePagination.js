import { onMounted, onUnmounted, ref } from "vue";

export function useInfinitePagination(loadFunction) {
  const scrollTrigger = ref(null);

  let observer = null;
  function setupObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadFunction();
        }
      },
      {
        rootMargin: "200px",
      },
    );
    if (scrollTrigger.value) {
      observer.observe(scrollTrigger.value);
    }
  }
  onMounted(() => {
    setupObserver();
  });
  onUnmounted(() => {
    observer?.disconnect();
  });
  return { scrollTrigger };
}
