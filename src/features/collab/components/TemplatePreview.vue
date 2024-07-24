<script setup lang="ts">
defineProps<{
  data: Record<string, unknown>;
}>();

const getPreviewLink = (data: Record<string, unknown>): string | undefined => {
  const templateUuid = data.template_uuid as string | undefined;
  if (!templateUuid) return undefined;
  return `${import.meta.env.VITE_BACKEND_URL}/api/collab/query/template/${templateUuid}/pdf/`;
};
</script>

<template>
  <a
    v-if="getPreviewLink(data)"
    class="font-medium underline text-formcolor"
    target="_blank"
    :href="getPreviewLink(data)"
  >
    > Preview Template
  </a>
</template>
