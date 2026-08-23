<template>
  <div class="address-section">
    <div class="section-header">
         <h2>Delivery Address</h2>
           <button @click="$emit('add-address')">  + Add Address </button>
    </div>
   <div
      v-for="address in addresses"
      :key="address.id"
      class="address-card"
    >
    <label>
        <input type="radio" name="address"
          :value="address.id"
          :checked="selectedAddress === address.id"
          @change="$emit('select', address.id)"
        />
           <strong>{{ address.title }}</strong>
    </label>
      <p> {{ address.street }} </p>
       <p> {{ address.city }}, {{ address.zip }}</p>
  </div>
  </div>
</template>

<script setup>

defineProps({
    addresses:{
        type:Array,
        required:true
    },
    selectedAddress:{
        type:[Number,String],
        default: null,
    }
})
defineEmits(["select", "add-address"]);
</script>

<style>

</style>