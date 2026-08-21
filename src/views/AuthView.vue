<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? "Log In to Your Account" : "Create an Account" }}</h2>

      <button class="google-btn" type="button">
        <img src="../assets/google.svg" class="google-icon" alt="google logo" />
        <span>Continue with Google</span>
      </button>

      <div class="divider">
        <span>OR</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="form-group">
          <label for="name">Full Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Enter password"
            />
            <button
              type="button"
              class="toggle-eye"
              @click="showPassword = !showPassword"
              aria-label="Toggle password visibility"
            >
              <img
                src="../assets/eye.svg"
                v-if="showPassword"
                alt="eye logo"
                class="eye-icon"
              />
              <img
                src="../assets/eye-off.svg"
                v-else
                alt="eye off logo"
                class="eye-icon"
              />
            </button>
          </div>
        </div>

        <div v-if="!isLogin" class="rules-list">
          <p :class="{ valid: rules.minLength }">
            <span class="icon">{{ rules.minLength ? "✓" : "•" }}</span> More
            than 8 characters
          </p>
          <p :class="{ valid: rules.hasUpper }">
            <span class="icon">{{ rules.hasUpper ? "✓" : "•" }}</span> At least
            1 uppercase letter (A-Z)
          </p>
          <p :class="{ valid: rules.hasLower }">
            <span class="icon">{{ rules.hasLower ? "✓" : "•" }}</span> At least
            1 lowercase letter (a-z)
          </p>
          <p :class="{ valid: rules.hasNumber }">
            <span class="icon">{{ rules.hasNumber ? "✓" : "•" }}</span> At least
            1 number (0-9)
          </p>
          <p :class="{ valid: rules.hasSpecial }">
            <span class="icon">{{ rules.hasSpecial ? "✓" : "•" }}</span> At
            least 1 special character (!@#$%^&*)
          </p>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-wrapper">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              placeholder="Confirm password"
            />
            <button
              type="button"
              class="toggle-eye"
              @click="showConfirmPassword = !showConfirmPassword"
              aria-label="Toggle confirm password visibility"
            >
              <img
                src="../assets/eye.svg"
                v-if="showConfirmPassword"
                alt="eye logo"
                class="eye-icon"
              />
              <img
                src="../assets/eye-off.svg"
                v-else
                alt="eye off logo"
                class="eye-icon"
              />
            </button>
          </div>
          <span v-if="confirmPassword && !isPasswordMatch" class="error-msg">
            Passwords do not match
          </span>
        </div>

        <BaseButton
          :text="isLogin ? 'Log In' : 'Sign Up'"
          class="submit-btn"
          :disabled="!isLogin && (!isPasswordValid || !isPasswordMatch)"
        />
      </form>

      <p class="toggle-text">
        <template v-if="isLogin">
          Don't have an account?
          <button class="link-btn" type="button" @click="toggleAuthMode">
            Sign up
          </button>
        </template>
        <template v-else>
          Already have an account?
          <button class="link-btn" type="button" @click="toggleAuthMode">
            Log in
          </button>
        </template>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";

const isLogin = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const rules = computed(() => ({
  minLength: password.value.length > 8,
  hasUpper: /[A-Z]/.test(password.value),
  hasLower: /[a-z]/.test(password.value),
  hasNumber: /[0-9]/.test(password.value),
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
}));

const isPasswordValid = computed(() => {
  return Object.values(rules.value).every(Boolean);
});

const isPasswordMatch = computed(() => {
  return password.value === confirmPassword.value;
});

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
  password.value = "";
  confirmPassword.value = "";
  showPassword.value = false;
  showConfirmPassword.value = false;
};

const handleSubmit = () => {
  if (!isLogin.value && (!isPasswordValid.value || !isPasswordMatch.value))
    return;
  console.log(isLogin.value ? "Logging in..." : "Signing up...");
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.35rem;
  color: #111827;
  text-align: center;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-btn:hover {
  background-color: #f9fafb;
}

.google-icon {
  width: 18px;
  height: 18px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.25rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
}

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

.form-group input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper input {
  padding-right: 2.5rem;
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

.error-msg {
  font-size: 0.78rem;
  color: #dc2626;
  margin-top: 0.2rem;
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-text {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  text-decoration: underline;
}
</style>
