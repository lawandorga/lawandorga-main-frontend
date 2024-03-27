<template>
  <div class="flex flex-col col-span-5 col-start-2 gap-2 mb-4 text-sm">
    <div class="text-neutral-500">von {{ mail.sender }}</div>
    <div class="text-neutral-500">an {{ mail.cc }}</div>
    <div class="mt-3 whitespace-pre-line">{{ mail.content }}</div>
  </div>
</template>

<script setup lang="ts">
import { ImportedMail } from "@/types/mailImports";
import { toRefs } from "vue";

const props = defineProps<{
  mail: ImportedMail;
}>();
const { mail } = toRefs(props);
</script>
