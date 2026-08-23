<template>
  
  <div v-if="visible"  class="modal-overlay">
        <div class="modal">
           <h2>Add Address </h2> 
           <form @submit.prevent="submitAddress">
             <input v-model="form.title" placeholder="Address title e.g. Home" required />
              <input v-model="form.street"  placeholder="Street" required />
         <input  v-model="form.city" placeholder="City" required
        />
        <input v-model="form.zip"  placeholder="ZIP Code" required/>
        <div class="actions">

          <button type="button" @click="$emit('close')"> Cancel  </button>
          <button type="submit">  Add Address </button>
        </div>
           </form>
        </div>

  </div>

</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  visible: {
    type: Boolean,
    required: true,
  }});

  const emit=defineEmits(['close','save']);

  const form=reactive({
  title: "",
  street: "",
  city: "",
  zip: "",
  })

  function submitAddress(){
    emit('save',{...form});
  form.title = "";
  form.street = "";
  form.city = "";
  form.zip = "";
  }
</script>

<style>

</style>