<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/outline";

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
    class="flex items-center gap-2 font-medium text-formcolor"
    target="_blank"
    rel="noopener noreferrer"
    :href="getPreviewLink(data)"
  >
    <ArrowTopRightOnSquareIcon class="w-4 h-4 stroke-2" />
    Preview Template
  </a>
</template>
