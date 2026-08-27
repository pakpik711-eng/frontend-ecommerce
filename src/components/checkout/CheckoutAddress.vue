<template>
  <div class="address-section">
    <div class="section-header">
      <h2>Delivery Address</h2>
      <button @click="$emit('add-address')">+ Add Address</button>
    </div>
    <div v-if="!addresses.length" class="no-addresses">
      No saved addresses yet - add one to continue.
    </div>
    <div v-for="address in addresses" :key="address.id" class="address-card">
      <label>
        <input
          type="radio"
          name="address"
          :value="address.id"
          :checked="selectedAddress === address.id"
          @change="$emit('select', address.id)"
        />
        <strong v-if="address.isDefault">Default</strong>
        <strong v-else>Address</strong>
      </label>
      <p>{{ address.addressLine1 }}</p>
      <p v-if="address.addressLine2">{{ address.addressLine2 }}</p>
      <p>{{ address.city }}, {{ address.state }}</p>
      <p>{{ address.country }} - {{ address.pincode }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  addresses: {
    type: Array,
    required: true,
  },
  selectedAddress: {
    type: String,
    default: null,
  },
});
defineEmits(["select", "add-address"]);
</script>
<style scoped>
.address-section {
  background: var(--color-surface);
  border: 0.5px solid var(--color-text-main);
  border-radius: 4px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.05rem;
  font-weight: 600;
}

.section-header button {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.no-addresses {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  padding: 0.5rem 0;
}

.address-card {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.9rem 1rem;
  margin-bottom: 0.7rem;
  transition: border-color 0.15s ease;
}

.address-card:has(input:checked) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.address-card label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: var(--color-text-main);
  cursor: pointer;
}

.address-card p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0.2rem 0 0 1.5rem;
}
</style>
