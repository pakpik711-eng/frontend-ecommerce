<template>
  <div class="rules-list">
    <p :class="{ valid: rules.minLength }">
      <span class="icon">{{ rules.minLength ? "✓" : "•" }}</span> More than 8
      characters
    </p>
    <p :class="{ valid: rules.hasUpper }">
      <span class="icon">{{ rules.hasUpper ? "✓" : "•" }}</span> At least 1
      uppercase letter (A-Z)
    </p>
    <p :class="{ valid: rules.hasLower }">
      <span class="icon">{{ rules.hasLower ? "✓" : "•" }}</span> At least 1
      lowercase letter (a-z)
    </p>
    <p :class="{ valid: rules.hasNumber }">
      <span class="icon">{{ rules.hasNumber ? "✓" : "•" }}</span> At least 1
      number (0-9)
    </p>
    <p :class="{ valid: rules.hasSpecial }">
      <span class="icon">{{ rules.hasSpecial ? "✓" : "•" }}</span> At least 1
      special character (!@#$%^&*)
    </p>
  </div>
</template>

<script setup>
defineProps({
  rules: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.rules-list {
  background-color: #f9fafb;
  padding: 0.75rem 0.85rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #f3f4f6;
}

.rules-list p {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.rules-list p.valid {
  color: #16a34a;
  font-weight: 500;
}

.icon {
  font-weight: bold;
}
</style>
