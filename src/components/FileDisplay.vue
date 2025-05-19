<script setup lang="ts">
import { isDataUrlDisplayable } from "@/utils/download";
import { CircleLoader } from "lorga-ui";
import { computed, toRefs, ref, watch } from "vue";

const props = defineProps<{
  selected: string | number | null;
  // eslint-disable-next-line no-unused-vars
  request: (_: string | number) => Promise<string>;
}>();
const { selected, request } = toRefs(props);

const message = window.btoa(
  "This file can't be displayed. If you think it should be, please contact it@law-orga.de. Maybe we can make it happen.",
);
const errorMessage = window.btoa("An error happened.");
const loading = ref(false);
const dataURL = ref<string | null>();

const loadDataUrl = (s: number | string) => {
  loading.value = true;
  request
    .value(s)
    .then((v: string) => {
      dataURL.value = v;
    })
    .catch(() => {
      dataURL.value = null;
    })
    .finally(() => {
      loading.value = false;
    });
};

if (selected.value) loadDataUrl(selected.value);

watch(selected, (newValue) => {
  if (!newValue) return;
  loadDataUrl(newValue);
});

const content = computed<string>(() => {
  if (!dataURL.value) return `data:text/plain;base64,${errorMessage}`;
  if (isDataUrlDisplayable(dataURL.value)) return dataURL.value;
  else return `data:text/plain;base64,${message}`;
});
</script>

<template>
  <CircleLoader v-if="loading" />
  <div
    v-else-if="content.includes('data:application/pdf')"
    class="flex h-full aspect-square"
  >
    <iframe
      class="w-full max-w-full"
      :src="content"
      title="File Content"
    ></iframe>
  </div>
  <div
    v-else-if="content.includes('data:image')"
    class="flex h-full aspect-square"
  >
    <img class="w-full max-w-full" :src="content" alt="File Content" />
  </div>
  <div v-else class="flex h-full aspect-square">
    <object class="w-full max-w-full" :data="content" frameborder="0">
      <span class="sr-only">File Content</span>
    </object>
  </div>
</template>
