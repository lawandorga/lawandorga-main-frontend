<template>
  <div class="relative self-center has-tooltip w-min">
    <div
      role="tooltip"
      class="invisible absolute px-4 py-2 transform -translate-x-1/2 rounded tooltip bg-neutral-500/90 w-max bottom-7 left-1/2 after:content-[''] after:absolute after:ml-[-5px] after:border-[5px] after:border-[rgb(115_115_115_/_0.9)_transparent_transparent_transparent] after:left-2/4 after:top-full"
    >
      {{ text }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

// props
const props = defineProps<{
  text: string;
}>();
const { text } = toRefs(props);
</script>
