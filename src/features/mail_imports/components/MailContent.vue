<script setup lang="ts">
import { toRefs } from "vue";
import { ImportedMail } from "../api/useMailImports";

const props = defineProps<{
  mail: ImportedMail;
}>();
const { mail } = toRefs(props);
</script>

<template>
  <div class="flex flex-col col-span-5 col-start-2 gap-2 mb-4 text-sm">
    <div class="text-neutral-500">von {{ mail.sender }}</div>
    <div class="text-neutral-500">an {{ mail.to }}</div>
    <div class="mt-3 whitespace-pre-line">{{ mail.content }}</div>
  </div>
</template>
