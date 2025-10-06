<script setup lang="ts">
import { toRefs } from "vue";
import { ImportedMail } from "../api/useMailImports";
import DeleteMailImport from "../actions/DeleteMailImport.vue";

const props = defineProps<{
  mail: ImportedMail;
  query: () => void;
}>();
const { mail } = toRefs(props);
</script>

<template>
  <div class="relative flex flex-col col-span-5 col-start-2 gap-2 mb-4 text-sm">
    <div class="absolute top-0 right-0">
      <DeleteMailImport :mail-uuid="mail.uuid" :query="query" />
    </div>
    <div class="text-neutral-500">von {{ mail.sender }}</div>
    <div class="text-neutral-500">an {{ mail.to }}</div>
    <div class="mt-3 whitespace-pre-line">{{ mail.content }}</div>
  </div>
</template>
