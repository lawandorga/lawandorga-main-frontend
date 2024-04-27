<template>
  <BoxHeadingStats
    class="max-w-2xl"
    :title="folder.folder.name"
    :show="selectedType === 'FOLDER' && selectedId === null"
    :stats="[record ? 'Record' : 'Folder']"
  >
    <template #buttons>
      <ChangeToken
        v-if="record"
        :query="query"
        :record-token="folder.folder.name"
        :record-uuid="record.uuid"
      />
      <FoldersChangeName
        v-else
        :folder-name="folder.folder.name"
        :folder-uuid="folder.folder.uuid"
        :query="query"
      />
    </template>
    <div class="prose"></div>
  </BoxHeadingStats>
</template>

<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { Content, FolderDetail } from "@/types/folders";
import FoldersChangeName from "@/features/folders/actions/FoldersChangeName.vue";
import { computed, toRefs } from "vue";
import ChangeToken from "@/features/records/actions/ChangeToken.vue";

const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  folder: FolderDetail;
  query: () => void;
}>();

const { folder } = toRefs(props);

const record = computed<Content | null>(() => {
  const item = folder.value.content.find((item: Content) => {
    return item.repository === "RECORDS_RECORD";
  });
  if (!item) return null;
  return item;
});
</script>
