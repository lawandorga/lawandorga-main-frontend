<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
