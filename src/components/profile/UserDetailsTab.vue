<template>
  <div class="tab-content">
    <h3>Profile Details</h3>

    <p v-if="isLoadingProfile" class="status-msg">Loading profile...</p>

    <form v-else @submit.prevent="handleSave">
      <div class="form-group">
        <label for="profileFirstName"> First Name </label>

        <input
          id="profileFirstName"
          v-model="form.firstName"
          type="text"
          placeholder="Enter your first name"
          required
        />
      </div>

      <div class="form-group">
        <label for="profileLastName"> Last Name </label>

        <input
          id="profileLastName"
          v-model="form.lastName"
          type="text"
          placeholder="Enter your last name"
          required
        />
      </div>

      <div class="form-group">
        <label for="profileEmail"> Email </label>

        <input id="profileEmail" v-model="form.email" type="email" disabled />
      </div>

      <div class="form-group">
        <label for="profilePhone"> Phone Number </label>

        <input
          id="profilePhone"
          v-model="form.phone"
          type="tel"
          placeholder="9876543210"
        />
      </div>

      <span v-if="form.phone && !isPhoneValid" class="error-msg">
        Enter a valid 10-digit phone number
      </span>

      <span v-if="apiError" class="error-msg">
        {{ apiError }}
      </span>

      <span v-if="successMessage" class="success-msg">
        {{ successMessage }}
      </span>

      <BaseButton
        :text="isSaving ? 'Saving...' : 'Save Changes'"
        class="save-btn"
        :disabled="!isPhoneValid || isSaving || !isDirty"
      />
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { userApi } from "@/services/userApi";
import BaseButton from "@/components/common/BaseButton.vue";

const userStore = useUserStore();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

const isLoadingProfile = ref(false);
const isSaving = ref(false);
const apiError = ref("");
const successMessage = ref("");

const populateForm = () => {
  const profile = userStore.profile;

  if (!profile) {
    return;
  }

  form.firstName = profile.firstName || "";
  form.lastName = profile.lastName || "";
  form.email = profile.email || "";
  form.phone = profile.phone || "";
};

const loadProfile = () => {
  apiError.value = "";

  if (userStore.profile) {
    populateForm();
    return Promise.resolve();
  }

  isLoadingProfile.value = true;

  return userApi
    .fetchProfile()
    .then((profile) => {
      userStore.setProfile(profile);
      populateForm();
    })
    .catch((error) => {
      apiError.value = error.message || "Failed to load profile";
    })
    .finally(() => {
      isLoadingProfile.value = false;
    });
};

onMounted(loadProfile);

const isDirty = computed(() => {
  if (!userStore.profile) {
    return false;
  }

  return (
    form.firstName.trim() !== (userStore.profile.firstName || "") ||
    form.lastName.trim() !== (userStore.profile.lastName || "") ||
    form.phone.trim() !== (userStore.profile.phone || "")
  );
});

const phoneRegex = /^[6-9]\d{9}$/;

const isPhoneValid = computed(() => {
  return phoneRegex.test(form.phone.trim());
});

const handleSave = () => {
  if (!isDirty.value || !isPhoneValid.value || isSaving.value) {
    return;
  }

  apiError.value = "";
  successMessage.value = "";
  isSaving.value = true;

  userApi
    .updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
    })
    .then((updatedProfile) => {
      userStore.setProfile(updatedProfile);
      populateForm();
      successMessage.value = "Profile details updated successfully!";
    })
    .catch((error) => {
      apiError.value = error.message || "Failed to update profile details.";
    })
    .finally(() => {
      isSaving.value = false;
    });
};
</script>

<style scoped>
.tab-content h3 {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  color: #111827;
}

.status-msg {
  font-size: 0.875rem;
  color: #6b7280;
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

input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

input:focus {
  border-color: #2563eb;
}

input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.save-btn {
  margin-top: 0.5rem;
}

.error-msg,
.success-msg {
  display: block;
  margin-top: 0.35rem;
  margin-bottom: 0.5rem;
  font-size: 0.78rem;
}

.error-msg {
  color: #dc2626;
}

.success-msg {
  color: #16a34a;
}
</style>
