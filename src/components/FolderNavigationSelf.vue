<template>
  <FolderNavigationRaw
    :groups="groups"
    :grouping="grouping"
    :selected-id="selectedId"
    :selected-type="selectedType"
    hide-grouping-control
    @selected="emit('selected', $event)"
    @grouping="emit('grouping', $event)"
  />
</template>

<script setup lang="ts">
import { IContent, IFolderDetail } from "@/types/folders";
import { h, toRefs, computed } from "vue";
import FoldersChangeName from "@/actions/FoldersChangeName.vue";
import ChangeToken from "@/features/records/actions/ChangeToken.vue";
import FolderNavigationRaw, {
  ContentGroupItem,
} from "./FolderNavigationRaw.vue";

const props = defineProps<{
  folder: IFolderDetail;
  query: () => void;
  grouping: boolean;
  selectedType: string;
  selectedId: string | number | null;
}>();

const { folder, query } = toRefs(props);

const emit = defineEmits(["grouping", "selected"]);

const record = computed<IContent | null>(() => {
  const item = folder.value.content.find((item: IContent) => {
    return item.repository === "RECORDS_RECORD";
  });
  if (!item) return null;
  return item;
});

const groups = computed<ContentGroupItem[]>(() => {
  return [
    {
      name: `${record.value ? "Record" : "Folder"}: ${
        folder.value?.folder.name
      }`,
      type: "FOLDER",
      children: [{ name: "Users With Access", type: "ACCESS", id: "ACCESS" }],
      buttons: [
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
      ],
    },
  ];
});
</script>
