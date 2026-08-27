<template>
  <div class="tab-content">
    <div class="header-row">
      <h3>Saved Addresses</h3>

      <button class="add-btn" type="button" @click="toggleAddForm">
        {{ showAddForm ? "Cancel" : "+ Add New" }}
      </button>
    </div>

    <form
      v-if="showAddForm"
      class="address-form"
      @submit.prevent="handleAddAddress"
    >
      <h4>Add New Address</h4>

      <div class="form-group">
        <label for="new-address-line-1"> Address Line 1 </label>
        <input
          id="new-address-line-1"
          v-model="newAddress.addressLine1"
          type="text"
          placeholder="House No., Street, Area"
          required
        />
      </div>

      <div class="form-group">
        <label for="new-address-line-2"> Address Line 2 </label>
        <input
          id="new-address-line-2"
          v-model="newAddress.addressLine2"
          type="text"
          placeholder="Apartment, Landmark, etc. (optional)"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="new-city"> City </label>
          <input
            id="new-city"
            v-model="newAddress.city"
            type="text"
            placeholder="Bengaluru"
            required
          />
        </div>

        <div class="form-group">
          <label for="new-state"> State </label>
          <input
            id="new-state"
            v-model="newAddress.state"
            type="text"
            placeholder="Karnataka"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="new-country"> Country </label>
          <input
            id="new-country"
            v-model="newAddress.country"
            type="text"
            placeholder="India"
            required
          />
        </div>

        <div class="form-group">
          <label for="new-pincode"> Pincode </label>
          <input
            id="new-pincode"
            v-model="newAddress.pincode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="560001"
            required
          />
        </div>
      </div>

      <label class="default-checkbox">
        <input v-model="newAddress.isDefault" type="checkbox" />
        <span> Make this my default address </span>
      </label>

      <div class="form-actions">
        <button
          type="button"
          class="secondary-btn"
          :disabled="isSaving"
          @click="toggleAddForm"
        >
          Cancel
        </button>

        <BaseButton
          :text="isSaving ? 'Saving...' : 'Save Address'"
          :disabled="isSaving"
        />
      </div>
    </form>

    <span v-if="error" class="error-msg">
      {{ error }}
    </span>

    <div v-if="isLoading && !addresses.length" class="empty-state">
      Loading addresses...
    </div>

    <div v-else-if="!addresses.length" class="empty-state">
      No saved addresses found.
    </div>

    <div v-else class="address-list">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="address-card"
        :class="{
          'default-address': address.isDefault,
        }"
      >
        <form
          v-if="editingId === address.id"
          class="edit-form"
          @submit.prevent="handleUpdateAddress(address.id)"
        >
          <div class="card-header">
            <div class="address-title">
              <strong>Edit Address</strong>
            </div>
          </div>

          <div class="form-group">
            <label :for="`edit-line-1-${address.id}`"> Address Line 1 </label>

            <input
              :id="`edit-line-1-${address.id}`"
              v-model="editAddress.addressLine1"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label :for="`edit-line-2-${address.id}`"> Address Line 2 </label>

            <input
              :id="`edit-line-2-${address.id}`"
              v-model="editAddress.addressLine2"
              type="text"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label :for="`edit-city-${address.id}`"> City </label>

              <input
                :id="`edit-city-${address.id}`"
                v-model="editAddress.city"
                type="text"
                required
              />
            </div>

            <div class="form-group">
              <label :for="`edit-state-${address.id}`"> State </label>

              <input
                :id="`edit-state-${address.id}`"
                v-model="editAddress.state"
                type="text"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label :for="`edit-country-${address.id}`"> Country </label>

              <input
                :id="`edit-country-${address.id}`"
                v-model="editAddress.country"
                type="text"
                required
              />
            </div>

            <div class="form-group">
              <label :for="`edit-pincode-${address.id}`"> Pincode </label>

              <input
                :id="`edit-pincode-${address.id}`"
                v-model="editAddress.pincode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                required
              />
            </div>
          </div>

          <label class="default-checkbox">
            <input
              v-model="editAddress.isDefault"
              type="checkbox"
              :disabled="address.isDefault"
            />

            <span> Make this my default address </span>
          </label>

          <p v-if="address.isDefault" class="default-hint">
            This is already your default address.
          </p>

          <div class="form-actions">
            <button
              type="button"
              class="secondary-btn"
              :disabled="isUpdating"
              @click="cancelEdit"
            >
              Cancel
            </button>

            <button type="submit" class="primary-btn" :disabled="isUpdating">
              {{ isUpdating ? "Updating..." : "Update Address" }}
            </button>
          </div>
        </form>

        <template v-else>
          <div class="card-header">
            <div class="address-title">
              <strong>Address</strong>

              <span v-if="address.isDefault" class="default-badge">
                Default
              </span>
            </div>

            <div class="card-actions">
              <button
                type="button"
                class="edit-btn"
                :disabled="editingId !== null"
                @click="startEdit(address)"
              >
                Edit
              </button>

              <button
                type="button"
                class="delete-btn"
                :disabled="deletingId === address.id"
                @click="handleRemoveAddress(address.id)"
              >
                {{ deletingId === address.id ? "Removing..." : "Remove" }}
              </button>
            </div>
          </div>

          <p>
            {{ address.addressLine1 }}
          </p>

          <p v-if="address.addressLine2">
            {{ address.addressLine2 }}
          </p>

          <p>
            {{ address.city }},
            {{ address.state }}
          </p>

          <p>
            {{ address.country }} -
            {{ address.pincode }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";
import { userApi } from "@/services/userApi";
import BaseButton from "@/components/common/BaseButton.vue";

const userStore = useUserStore();

const { addresses } = storeToRefs(userStore);

const showAddForm = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isUpdating = ref(false);
const deletingId = ref(null);
const editingId = ref(null);
const error = ref("");

const newAddress = reactive({
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  isDefault: false,
});

const editAddress = reactive({
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  isDefault: false,
});

const resetAddForm = () => {
  newAddress.addressLine1 = "";
  newAddress.addressLine2 = "";
  newAddress.city = "";
  newAddress.state = "";
  newAddress.country = "India";
  newAddress.pincode = "";
  newAddress.isDefault = false;
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  error.value = "";

  if (!showAddForm.value) {
    resetAddForm();
  }
};

const loadAddresses = () => {
  isLoading.value = true;
  error.value = "";

  return userApi
    .fetchAddresses()
    .then((data) => {
      userStore.setAddresses(data);
    })
    .catch((err) => {
      error.value = err.message || "Failed to load addresses";
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(loadAddresses);

const handleAddAddress = () => {
  error.value = "";
  isSaving.value = true;

  userApi
    .addAddress({
      addressLine1: newAddress.addressLine1.trim(),
      addressLine2: newAddress.addressLine2.trim(),
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      country: newAddress.country.trim(),
      pincode: newAddress.pincode.trim(),
      isDefault: newAddress.isDefault,
    })
    .then((address) => {
      if (address.isDefault) {
        return userApi.fetchAddresses();
      }

      userStore.addAddressToStore(address);
      return null;
    })
    .then((data) => {
      if (data) {
        userStore.setAddresses(data);
      }

      resetAddForm();
      showAddForm.value = false;
    })
    .catch((err) => {
      error.value = err.message || "Failed to add address";
    })
    .finally(() => {
      isSaving.value = false;
    });
};

const startEdit = (address) => {
  error.value = "";
  editingId.value = address.id;

  editAddress.addressLine1 = address.addressLine1 || "";
  editAddress.addressLine2 = address.addressLine2 || "";
  editAddress.city = address.city || "";
  editAddress.state = address.state || "";
  editAddress.country = address.country || "";
  editAddress.pincode = address.pincode || "";
  editAddress.isDefault = address.isDefault || false;
};

const cancelEdit = () => {
  editingId.value = null;

  editAddress.addressLine1 = "";
  editAddress.addressLine2 = "";
  editAddress.city = "";
  editAddress.state = "";
  editAddress.country = "";
  editAddress.pincode = "";
  editAddress.isDefault = false;

  error.value = "";
};

const handleUpdateAddress = (addressId) => {
  error.value = "";
  isUpdating.value = true;

  userApi
    .updateAddress(addressId, {
      addressLine1: editAddress.addressLine1.trim(),
      addressLine2: editAddress.addressLine2.trim(),
      city: editAddress.city.trim(),
      state: editAddress.state.trim(),
      country: editAddress.country.trim(),
      pincode: editAddress.pincode.trim(),
    })
    .then(() => {
      if (editAddress.isDefault) {
        return userApi.setDefaultAddress(addressId);
      }

      return null;
    })
    .then(() => {
      return userApi.fetchAddresses();
    })
    .then((data) => {
      userStore.setAddresses(data);
      cancelEdit();
    })
    .catch((err) => {
      error.value = err.message || "Failed to update address";
    })
    .finally(() => {
      isUpdating.value = false;
    });
};

const handleRemoveAddress = (id) => {
  if (!confirm("Are you sure you want to remove this address?")) {
    return;
  }

  error.value = "";
  deletingId.value = id;

  userApi
    .deleteAddress(id)
    .then(() => {
      return userApi.fetchAddresses();
    })
    .then((data) => {
      userStore.setAddresses(data);
    })
    .catch((err) => {
      error.value = err.message || "Failed to remove address";
    })
    .finally(() => {
      deletingId.value = null;
    });
};
</script>

<style scoped>
.tab-content {
  width: 100%;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #111827;
}

h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
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

.add-btn:hover {
  text-decoration: underline;
}

.address-form,
.edit-form {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.address-form {
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

label {
  font-size: 0.8rem;
  color: #374151;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.55rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 0.875rem;
  outline: none;
  box-sizing: border-box;
  background: #ffffff;
}

input:focus {
  border-color: #2563eb;
}

input:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  background: #f3f4f6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.default-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
  cursor: pointer;
}

.default-checkbox input {
  width: auto;
  margin: 0;
}

.default-hint {
  margin: -0.35rem 0 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.primary-btn,
.secondary-btn {
  padding: 0.55rem 0.85rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
}

.primary-btn:hover {
  background: #2d2f34;
}

.secondary-btn {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.secondary-btn:hover {
  background: #f3f4f6;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-card {
  padding: 0.9rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.address-card.default-address {
  border-color: #93c5fd;
  background-color: #f8fbff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.address-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.default-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #2563eb;
  background-color: #dbeafe;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;
}

.edit-btn {
  color: #2563eb;
  font-weight: 600;
}

.delete-btn {
  color: #dc2626;
}

.edit-btn:hover,
.delete-btn:hover {
  text-decoration: underline;
}

.edit-btn:disabled,
.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.address-card p {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0.15rem 0;
}

.error-msg {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: #dc2626;
}

.empty-state {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  padding: 1.5rem 0;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .card-header {
    flex-direction: column;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-actions {
    flex-wrap: wrap;
  }
}
</style>
