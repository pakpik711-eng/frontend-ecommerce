<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        required
      />
      <button
        type="button"
        class="toggle-eye"
        @click="showPassword = !showPassword"
        :aria-label="`Toggle ${label} visibility`"
      >
        <img
          src="@/assets/eye.svg"
          v-if="showPassword"
          alt="Show password"
          class="eye-icon"
        />
        <img
          src="@/assets/eye-off.svg"
          v-else
          alt="Hide password"
          class="eye-icon"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "Enter password" },
  modelValue: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);

const showPassword = ref(false);
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-wrapper input:focus {
  border-color: #2563eb;
}

.toggle-eye {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.eye-icon {
  width: 18px;
  height: 18px;
  opacity: 0.55;
  transition:
    opacity 0.2s ease,
    filter 0.2s ease;
}

.toggle-eye:hover .eye-icon {
  opacity: 1;
  filter: brightness(0.2);
}
</style>
