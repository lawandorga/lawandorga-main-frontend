<script lang="ts">
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div
    class="px-4 py-2 rounded"
    :class="{
      'bg-blue-200 text-blue-800': type === 'info',
      'bg-green-200 text-green-800': type === 'success',
      'bg-yellow-200 text-yellow-800': type === 'warning',
      'bg-red-200 text-red-800': type === 'error',
    }"
  >
    <slot />
  </div>
</template>
