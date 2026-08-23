<template>
  <div class="tab-content">
    <div class="header-row">
      <h3>Saved Addresses</h3>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? "Cancel" : "+ Add New" }}
      </button>
    </div>

    <form
      v-if="showForm"
      class="address-form"
      @submit.prevent="handleAddAddress"
    >
      <div class="form-group">
        <label>Label</label>
        <input
          v-model="newAddress.title"
          placeholder="e.g. Home, Work"
          required
        />
      </div>
      <div class="form-group">
        <label>Street Address</label>
        <input v-model="newAddress.street" placeholder="123 Main St" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input v-model="newAddress.city" required />
        </div>
        <div class="form-group">
          <label>ZIP Code</label>
          <input v-model="newAddress.zip" required />
        </div>
      </div>
      <BaseButton
        :text="userStore.isLoading ? 'Saving...' : 'Save Address'"
        :disabled="userStore.isLoading"
      />
    </form>

    <div v-if="userStore.isLoading && !addresses.length" class="empty-state">
      Loading addresses...
    </div>

    <div v-else-if="!addresses.length" class="empty-state">
      No saved addresses found.
    </div>

    <div v-else class="address-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-card">
        <div class="card-header">
          <strong>{{ addr.title }}</strong>
          <button
            class="delete-btn"
            :disabled="userStore.isLoading"
            @click="removeAddress(addr.id)"
          >
            Remove
          </button>
        </div>
        <p>{{ addr.street }}</p>
        <p>{{ addr.city }}, {{ addr.zip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/common/BaseButton.vue";

const userStore = useUserStore();
const { addresses } = storeToRefs(userStore);

const showForm = ref(false);
const newAddress = reactive({ title: "", street: "", city: "", zip: "" });

onMounted(() => {
  userStore.loadAddresses();
});

const handleAddAddress = async () => {
  try {
    await userStore.addAddress({ ...newAddress });
    newAddress.title = "";
    newAddress.street = "";
    newAddress.city = "";
    newAddress.zip = "";
    showForm.value = false;
  } catch (err) {
    alert(err || "Failed to add address");
  }
};

const removeAddress = async (id) => {
  try {
    await userStore.removeAddress(id);
  } catch (err) {
    alert(err || "Failed to remove address");
  }
};
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

h3 {
  font-size: 1.15rem;
  color: #111827;
}

.add-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
}

.empty-state {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  padding: 1.5rem 0;
}

.address-form {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

label {
  font-size: 0.8rem;
  color: #374151;
}

input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-card {
  padding: 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.address-card p {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0.1rem 0;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.78rem;
  cursor: pointer;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
