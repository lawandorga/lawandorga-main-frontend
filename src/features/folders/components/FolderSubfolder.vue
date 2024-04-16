<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { computed, toRefs } from "vue";
import { FolderDetail } from "@/types/folders";
import { CircleLoader } from "lorga-ui";

const props = defineProps<{
  folder: FolderDetail | null;
  selectedId: string | number | null;
  selectedType: string;
}>();
const { selectedId, selectedType, folder } = toRefs(props);

const selectedFolder = computed(() => {
  return folder.value?.subfolders.find((f) => f.uuid === selectedId.value);
});
</script>

<template>
  <div v-if="selectedFolder">
    <BoxHeadingStats
      :title="selectedFolder.name"
      :show="selectedType === 'SUBFOLDER'"
      :stats="[]"
    >
      <router-link
        :to="{ name: 'folders-detail', params: { uuid: selectedFolder.uuid } }"
      >
        Open
      </router-link>
    </BoxHeadingStats>
  </div>
  <div
    v-else-if="
      selectedType === 'SUBFOLDER' &&
      selectedId &&
      selectedId !== folder?.folder.uuid
    "
  >
    <CircleLoader />
  </div>
</template>
