<script setup lang="ts">
import { toRefs } from "vue";

import { MailAttachment } from "../api/useMailImports";

const props = defineProps<{
  attachments: Array<MailAttachment>;
}>();
const { attachments } = toRefs(props);

const getLink = (id: string) =>
  `${import.meta.env.VITE_BACKEND_URL}/api/mail_imports/query/mail_attachments/${id}/`;
</script>

<template>
  <ul class="col-span-full flex flex-wrap gap-2">
    <li v-for="attachment in attachments" :key="attachment.uuid">
      <a
        :href="getLink(attachment.uuid)"
        target="_blank"
        rel="noopener"
        class="rounded-md border border-slate-400 bg-slate-100 p-1 text-sm"
      >
        {{ attachment.name }}
      </a>
    </li>
  </ul>
</template>
