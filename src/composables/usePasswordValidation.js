import { computed } from "vue";

export function usePasswordValidation(passwordRef) {
  const rules = computed(() => ({
    minLength: (passwordRef.value || "").length >= 8,
    hasUpper: /[A-Z]/.test(passwordRef.value || ""),
    hasLower: /[a-z]/.test(passwordRef.value || ""),
    hasNumber: /[0-9]/.test(passwordRef.value || ""),
    hasSpecial: /[!@#$%^&*]/.test(passwordRef.value || ""),
  }));

  const isValid = computed(() => Object.values(rules.value).every(Boolean));

  return {
    rules,
    isValid,
  };
}
