<script setup lang="ts">
defineProps<{ property?: string }>();
</script>

<template>
  <div
    v-if="property"
    class="px-1 py-0 text-xs font-medium leading-tight tracking-wide text-gray-800 uppercase rounded shadow whitespace-nowrap ring-1 ring-gray-700"
  >
    {{ property }}
  </div>
</template>
