<script setup lang="ts">
defineProps<{ property?: string }>();
</script>

<template>
  <div
    v-if="property"
    class="rounded px-1 py-0 text-xs leading-tight font-medium tracking-wide whitespace-nowrap text-gray-800 uppercase shadow ring-1 ring-gray-700"
  >
    {{ property }}
  </div>
</template>
