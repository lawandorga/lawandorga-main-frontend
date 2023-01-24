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
import { IFolderDetail } from "@/types/folders";
import { h, toRefs, computed } from "vue";
import FoldersChangeName from "@/actions/FoldersChangeName.vue";
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

const groups = computed<ContentGroupItem[]>(() => {
  return [
    {
      name: `Folder: ${folder.value?.folder.name}`,
      type: "FOLDER",
      children: [{ name: "Users With Access", type: "ACCESS", id: "ACCESS" }],
      buttons: [
        h(FoldersChangeName, {
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
