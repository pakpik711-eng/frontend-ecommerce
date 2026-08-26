<template>
  <div class="search-box">
    <input v-model="searchText" type="text" placeholder="Search..." class="search-input"  @keyup.enter="performSearch" />
    <button class="search-btn"  @click="performSearch">Search</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchText=ref("")
const router=useRouter()

function performSearch(){
  const query=searchText.value.trim();

  if (!query) {
    return;
  }
  router.push({
    path:'/search',
      query: {
      q: query
    }
  })
}
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 480px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border, #e3e3e6);
  border-right: none;
  border-radius: var(--radius-pill) 0 0 var(--radius-pill);
  outline: none;
  font-size: 0.9rem;
  background-color: var(--color-bg, #f7f7f8);
  color: var(--color-text-main, #14151a);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.search-input:focus {
  border-color: var(--color-primary, #111214);
  background-color: var(--color-surface, #ffffff);
}

.search-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-primary, #111214);
  background-color: var(--color-primary, #111214);
  color: #ffffff;
  border-radius: 0 var(--radius-pill) var(--radius-pill) 0;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.search-btn:hover {
  background-color: var(--color-primary-hover, #000000);
}

@media (max-width: 480px) {
  .search-input {
    padding: 9px 12px;
  }

  .search-btn {
    padding: 9px 14px;
  }
}
</style>