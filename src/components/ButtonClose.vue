<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["click"]);
</script>

<template>
  <button
    type="button"
    class="bg-white p-0.5 border-2 border-transparent rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 hover:border-gray-100 focus:outline-none focus:ring-0"
    @click="emit('click')"
  >
    <span class="sr-only">Close</span>
    <XMarkIcon class="w-6 h-6" aria-hidden="true" />
  </button>
</template>
