<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["click"]);
</script>

<template>
  <button
    type="button"
    class="rounded-md border-2 border-transparent bg-white p-0.5 text-gray-400 hover:border-gray-100 hover:bg-gray-100 hover:text-gray-500 focus:ring-0 focus:outline-none"
    @click="emit('click')"
  >
    <span class="sr-only">Close</span>
    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
  </button>
</template>
