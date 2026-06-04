<script lang="ts" setup>
defineProps<{
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="inline-flex items-center px-4 py-2 text-sm font-medium transition duration-100 bg-white border shadow-sm cursor-pointer rounded-xl border-formcolor text-formcolor hover:bg-formcolor/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-formcolor"
  >
    <slot />
  </button>
</template>
