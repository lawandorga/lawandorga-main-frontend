<script setup lang="ts">
import { formatDate } from "@/utils/date";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref } from "vue";
import { IHistory } from "@/features/collab/components/FolderCollab.vue";

defineProps<{
  history: IHistory[];
}>();

const open = ref(false);

const selectedVersion = ref<IHistory>();
const selectedVersionModalOpen = ref(false);

const versionSelected = (item: IHistory) => {
  open.value = false;
  selectedVersion.value = item;
  selectedVersionModalOpen.value = true;
};
</script>

<template>
  <ButtonNormal kind="action" @click="open = true">Show History</ButtonNormal>
  <ModalFree v-model="open" title="History">
    <ul class="space-y-2">
      <li v-for="item in history" :key="item.time">
        <button
          type="button"
          class="w-full px-3 py-2 font-medium text-left text-gray-700 bg-gray-100 border-2 border-gray-300 rounded hover:bg-gray-200"
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
    <div class="text-sm font-medium text-right text-gray-600 uppercase">
      Saved by: {{ selectedVersion.user }}
    </div>
  </ModalFree>
</template>
