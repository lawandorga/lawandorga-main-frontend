<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = defineProps<{ text: string }>();
const { text } = toRefs(props);

const formatted = computed(() => {
  if (text.value === "UPLOAD") return "UPLOAD LINK";
  if (text.value === "RECORD") return "DATA SHEET";
  return text.value;
});
</script>

<template>
  <div
    class="px-1 py-0 text-xs font-medium leading-tight tracking-wide text-gray-800 uppercase bg-gray-300 rounded shadow whitespace-nowrap ring-1 ring-gray-700"
  >
    {{ formatted }}
  </div>
</template>
