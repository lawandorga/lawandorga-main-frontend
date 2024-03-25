<template>
  <div
    class="flex items-center justify-center w-6 h-6 text-sm font-bold text-red-800 bg-red-200 rounded-full"
    :class="additionalClasses"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  additionalClasses?: string;
}>();
const { additionalClasses } = toRefs(props);
</script>
