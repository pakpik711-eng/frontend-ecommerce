<template>
  <div class="payment-section">
    <h2>Payment Method</h2>
    <label>

      <input
        type="radio"
        value="COD"
        :checked="modelValue === 'COD'"
        @change="$emit('update:modelValue', 'COD')"
      />
      Cash on Delivery 
    </label>
    <label>
      <input
        type="radio"
        value="MASTERCARD"
        :checked="modelValue === 'MASTERCARD'"
        @change="$emit('update:modelValue', 'MASTERCARD')"
      />
      Credit Card
      <span class="card-badges">
        <img
          class="badge-img"
          src="https://cdn-icons-png.flaticon.com/512/5968/5968397.png"
          alt="Visa"
        />
        <img
          class="badge-img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1920px-Mastercard-logo.svg.png"
          alt="Mastercard"
        />
      </span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
  type: String,
  required: true,
  },
});
defineEmits([
  "update:modelValue",
]);
</script>

<style scoped>
.payment-section {
  background: var(--color-surface);
  border: .5px solid var(--color-text-main);
  border-radius: 4px;
  padding: 1.5rem;
}

.payment-section h2 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.payment-section label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: var(--color-text-main);
  padding: 0.6rem 0;
  cursor: pointer;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.25rem;
}

.badge-img {
  height: 20px;
  width: auto;
  object-fit: contain;
}
</style>