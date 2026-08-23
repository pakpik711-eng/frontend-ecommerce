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
      MasterCard
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

<style>

</style>