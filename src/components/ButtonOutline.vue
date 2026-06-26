<script lang="ts" setup>
defineProps<{
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="border-formcolor text-formcolor hover:bg-formcolor/5 focus:ring-formcolor inline-flex cursor-pointer items-center rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm transition duration-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
  >
    <slot />
  </button>
</template>
