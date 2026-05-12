<script setup lang="ts">
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref } from "vue";

import { History } from "@/features/collab/components/FolderCollab.vue";
import { formatDate } from "@/utils/date";

defineProps<{
  history: History[];
}>();

const open = ref(false);

const selectedVersion = ref<History>();
const selectedVersionModalOpen = ref(false);

const versionSelected = (item: History) => {
  open.value = false;
  selectedVersion.value = item;
  selectedVersionModalOpen.value = true;
};
</script>

<template>
  <ButtonNormal kind="link" @click="open = true">Show History</ButtonNormal>
  <ModalFree v-model="open" title="History">
    <ul class="space-y-2">
      <li v-for="item in history" :key="item.time">
        <button
          type="button"
          class="w-full rounded border-2 border-gray-300 bg-gray-100 px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-200"
          @click="versionSelected(item)"
        >
          {{ formatDate(item.time) }}
        </button>
      </li>
    </ul>
  </ModalFree>
  <ModalFree
    v-if="selectedVersion"
    v-model="selectedVersionModalOpen"
    :title="`Version of ${formatDate(selectedVersion.time)}`"
    width="max-w-3xl"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose" v-html="selectedVersion.text" />
    <hr class="my-2" />
    <div class="text-right text-sm font-medium text-gray-600 uppercase">
      Saved by: {{ selectedVersion.user }}
    </div>
  </ModalFree>
</template>
