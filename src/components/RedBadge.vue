<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  additionalClasses?: string;
}>();
const { additionalClasses } = toRefs(props);
</script>

<template>
  <div
    class="flex h-6 w-6 items-center justify-center rounded-full bg-red-200 text-sm font-bold text-red-800"
    :class="additionalClasses"
  >
    <slot />
  </div>
</template>
