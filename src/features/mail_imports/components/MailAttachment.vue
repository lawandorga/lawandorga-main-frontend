<template>
  <ul class="flex flex-wrap gap-2 col-span-full">
    <li v-for="attachment in attachments" :key="attachment.location">
      <a
        :href="attachment.location"
        target="_blank"
        class="p-1 text-sm border rounded-md bg-slate-100 border-slate-400"
      >
        {{ attachment.name }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { MailAttachment } from "../api/useMailImports";

const props = defineProps<{
  attachments: Array<MailAttachment>;
}>();
const { attachments } = toRefs(props);
</script>
