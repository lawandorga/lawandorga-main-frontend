<template>
  <FolderNavigationRaw
    :groups="groups"
    :grouping="grouping"
    :ungrouped-buttons="ungroupedButtons"
    :selected-id="selectedId"
    :selected-type="selectedType"
    hide-grouping-control
    @selected="emit('selected', $event)"
    @grouping="emit('grouping', $event)"
  />
</template>

<script setup lang="ts">
import { h, toRefs, computed } from "vue";
import FoldersChangeName from "@/features/folders/actions/FoldersChangeName.vue";
import ChangeToken from "@/features/records/actions/ChangeToken.vue";
import FolderNavigationRaw, {
  ContentGroupItem,
} from "./FolderNavigationRaw.vue";
import { Content, FolderDetail } from "../api/useFolder";

const props = defineProps<{
  folder: FolderDetail;
  query: () => void;
  grouping: boolean;
  selectedType: string;
  selectedId: string | number | null;
}>();

const { folder, query } = toRefs(props);

const emit = defineEmits(["grouping", "selected"]);

const record = computed<Content | null>(() => {
  const item = folder.value.content.find((item: Content) => {
    return item.repository === "RECORDS_RECORD";
  });
  if (!item) return null;
  return item;
});

const changeNameButton = computed(() =>
  record.value
    ? h(ChangeToken, {
        text: "Change Record Token",
        recordToken: folder.value.folder.name,
        recordUuid: record.value.uuid,
        query: query.value,
      })
    : h(FoldersChangeName, {
        text: "Change Folder Name",
        folderName: folder.value.folder.name,
        folderUuid: folder.value.folder.uuid,
        query: query.value,
      }),
);

const ungroupedButtons = computed(() => [changeNameButton.value]);

const groups = computed<ContentGroupItem[]>(() => {
  return [
    {
      name: `${record.value ? "Record" : "Folder"}: ${
        folder.value?.folder.name
      }`,
      type: "FOLDER",
      children: [
        { name: "Users With Access", type: "ACCESS", id: "ACCESS" },
        { name: "Subfolders", type: "SUBFOLDER", id: "SUBFOLDER" },
      ],
      buttons: [changeNameButton.value],
    },
  ];
});
</script>
