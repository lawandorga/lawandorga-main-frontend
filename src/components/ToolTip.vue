<script setup lang="ts">
import { toRefs } from "vue";

// props
const props = defineProps<{
  text: string;
  toolTipId?: string;
}>();
const { text, toolTipId } = toRefs(props);
</script>

<template>
  <div class="has-tooltip relative w-min self-center">
    <div
      :id="toolTipId"
      role="tooltip"
      class="tooltip pointer-events-none invisible absolute bottom-7 left-1/2 w-max -translate-x-1/2 transform rounded bg-neutral-500/90 px-4 py-2 font-normal text-black after:absolute after:top-full after:left-2/4 after:ml-[-5px] after:border-[5px] after:border-[rgb(115_115_115/0.9)_transparent_transparent_transparent] after:content-['']"
    >
      {{ text }}
    </div>
    <slot />
  </div>
</template>
