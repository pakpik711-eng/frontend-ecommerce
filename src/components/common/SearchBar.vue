<template>
  <div class="search-box">
    <input type="text" placeholder="Search..." class="search-input" />
    <button class="search-btn">Search</button>
  </div>
</template>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 450px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  outline: none;
  font-size: 0.9rem;
}

.search-input:focus {
  border-color: #2563eb;
}

.search-btn {
  padding: 8px 16px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 0 6px 6px 0;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
