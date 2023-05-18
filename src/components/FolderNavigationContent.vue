<template>
  <FolderNavigationRaw
    :groups="groups"
    :grouping="grouping"
    :selected-id="selectedId"
    :selected-type="selectedType"
    @selected="emit('selected', $event)"
    @grouping="emit('grouping', $event)"
  />
</template>

<script setup lang="ts">
import { IFolderDetail } from "@/types/folders";
import { computed, h, toRefs } from "vue";
import FilesUploadMultipleFiles from "@/actions/FilesUploadMultipleFiles.vue";
import FilesUploadFile from "@/actions/FilesUploadFile.vue";
import QuestionnairesPublishQuestionnaire from "@/actions/QuestionnairesPublishQuestionnaire.vue";
import RecordsCreateRecordWithinFolder from "@/actions/RecordsCreateRecordWithinFolder.vue";
import UploadsCreateLink from "@/actions/UploadsCreateLink.vue";
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
  const g: ContentGroupItem[] = [];

  g.push({
    name: "Data Sheets",
    type: "RECORD",
    children: folder.value.content
      .filter((c) => c.repository === "RECORD")
      .map((c) => ({ name: c.name, type: "RECORD", id: c.uuid })),
    buttons: [
      h(RecordsCreateRecordWithinFolder, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
    ],
  });

  g.push({
    name: "Chat",
    type: "MESSAGES",
    children: [],
    buttons: [],
  });

  g.push({
    name: "Files",
    type: "FILE",
    children: folder.value.content
      .filter((c) => c.repository === "FILE")
      .map((c) => ({ name: c.name, type: "FILE", id: c.uuid })),
    buttons: [
      h(FilesUploadFile, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
      h(FilesUploadMultipleFiles, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
    ],
  });

  g.push({
    name: "Questionnaires",
    type: "QUESTIONNAIRE",
    children: folder.value.content
      .filter((c) => c.repository === "QUESTIONNAIRE")
      .map((c) => ({
        name: c.name,
        type: "QUESTIONNAIRE",
        id: c.uuid,
      })),
    buttons: [
      h(QuestionnairesPublishQuestionnaire, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
    ],
  });

  g.push({
    name: "Public Uploads",
    type: "UPLOAD",
    children: folder.value.content
      .filter((c) => c.repository === "UPLOAD")
      .map((c) => ({
        name: c.name,
        type: "UPLOAD",
        id: c.uuid,
      })),
    buttons: [
      h(UploadsCreateLink, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
    ],
  });

  g.push({
    name: "Timeline (Beta)",
    type: "TIMELINE",
    children: [],
    buttons: [],
  });

  return g;
});
</script>
