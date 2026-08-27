<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <h2>Add Address</h2>
        <form @submit.prevent="submitAddress">
          <div class="field">
            <label>Address Line 1</label>
            <input
              v-model="form.addressLine1"
              placeholder="Street address"
              required
            />
          </div>
          <div class="field">
            <label>Address Line 2 (optional)</label>
            <input
              v-model="form.addressLine2"
              placeholder="Apartment, suite, etc."
            />
          </div>
          <div class="field-row">
            <div class="field">
              <label>City</label>
              <input v-model="form.city" placeholder="City" required />
            </div>
            <div class="field">
              <label>State</label>
              <input v-model="form.state" placeholder="State" required />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Country</label>
              <input v-model="form.country" placeholder="Country" required />
            </div>
            <div class="field">
              <label>Pincode</label>
              <input
                v-model="form.pincode"
                placeholder="Pincode"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                @input="form.pincode = form.pincode.replace(/\D/g, '')"
                required
              />
            </div>
          </div>
          <label class="checkbox-field">
            <input type="checkbox" v-model="form.isDefault" />
            Set as default address
          </label>
          <div class="actions">
            <button type="button" class="btn-cancel" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn-submit">Add Address</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive } from "vue";

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  isDefault: false,
});

function resetForm() {
  form.addressLine1 = "";
  form.addressLine2 = "";
  form.city = "";
  form.state = "";
  form.country = "";
  form.pincode = "";
  form.isDefault = false;
}

function submitAddress() {
  emit("save", { ...form });
  resetForm();
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.modal {
  width: 100%;
  max-width: 440px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e3e3e6);
  border-radius: 4px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.modal h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text-main, #14151a);
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.field-row {
  display: flex;
  gap: 1rem;
}

.field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.modal input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border, #e3e3e6);
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  background: var(--color-surface, #ffffff);
  color: var(--color-text-main, #14151a);
  transition: border-color 0.2s;
}

.modal input:focus {
  border-color: var(--color-primary, #111214);
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-main, #14151a);
  cursor: pointer;
}

.checkbox-field input {
  width: auto;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.actions button {
  padding: 0.65rem 1.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  border: 1px solid var(--color-border, #e3e3e6);
  background: var(--color-surface, #ffffff);
  color: var(--color-text-main, #14151a);
  transition: background-color 0.15s ease;
}

.btn-cancel:hover {
  background: var(--color-bg, #f7f7f8);
}

.btn-submit {
  border: 1px solid var(--color-primary, #111214);
  background: var(--color-primary, #111214);
  color: #ffffff;
}

.btn-submit:hover {
  background: var(--color-primary-hover, #000000);
  border-color: var(--color-primary-hover, #000000);
}

@media (max-width: 480px) {
  .field-row {
    flex-direction: column;
  }
}
</style>
