<template>
  <div
    v-if="content.includes('data:application/pdf')"
    class="flex h-full aspect-square"
  >
    <iframe
      class="w-full max-w-full"
      :src="content"
      title="File Content"
    ></iframe>
  </div>
  <div
    v-else
    class="aspect-square"
    :class="{ 'flex h-full': !content.includes('data:image') }"
  >
    <object class="w-full max-w-full" :data="content" frameborder="0">
      <span class="sr-only">File Content</span>
    </object>
  </div>
</template>

<script setup lang="ts">
import { isDataUrlDisplayable } from "@/utils/download";
import { computed, toRefs } from "vue";

const props = defineProps<{ dataUrl: string | null }>();
const { dataUrl } = toRefs(props);

const message = window.btoa(
  "This file can't be displayed. If you think it should be, please contact it@law-orga.de. Maybe we can make it happen.",
);
const errorMessage = window.btoa("An error happened.");

const content = computed<string>(() => {
  if (dataUrl.value === null) return `data:text/plain;base64,${errorMessage}`;
  if (isDataUrlDisplayable(dataUrl.value)) return dataUrl.value;
  else return `data:text/plain;base64,${message}`;
});
</script>
