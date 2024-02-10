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
import FilesUploadMultipleFiles from "@/features/files/actions/FilesUploadMultipleFiles.vue";
import FilesUploadFile from "@/features/files/actions/FilesUploadFile.vue";
import QuestionnairesPublishQuestionnaire from "@/features/questionnaires/actions/QuestionnairesPublishQuestionnaire.vue";
import RecordsCreateRecordWithinFolder from "@/features/records/actions/RecordsCreateRecordWithinFolder.vue";
import UploadsCreateLink from "@/features/uploads/actions/UploadsCreateLink.vue";
import FolderNavigationRaw, {
  ContentGroupItem,
} from "@/features/folders/components/FolderNavigationRaw.vue";
import CollabCreate from "@/features/collab/actions/CollabCreate.vue";

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
    name: "Timeline",
    type: "TIMELINE",
    children: [],
    buttons: [],
  });

  g.push({
    name: "Collabs",
    type: "COLLAB",
    children: folder.value.content
      .filter((c) => c.repository === "COLLAB")
      .map((c) => ({ name: c.name, type: "COLLAB", id: c.uuid })),
    buttons: [
      h(CollabCreate, {
        query: query.value,
        folderUuid: folder.value.folder.uuid,
      }),
    ],
  });

  g.push({
    name: "Subfolders",
    type: "SUBFOLDER",
    children: folder.value.subfolders.map((c) => ({
      name: c.name,
      type: "FOLDER",
      id: c.uuid,
    })),
    buttons: [],
  });

  return g;
});
</script>
