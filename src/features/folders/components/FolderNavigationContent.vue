<script setup lang="ts">
import { computed, h, toRefs } from "vue";
import FilesUploadMultipleFiles from "@/features/files/actions/UploadMultipleFiles.vue";
import FilesUploadFile from "@/features/files/actions/UploadFile.vue";
import QuestionnairesPublishQuestionnaire from "@/features/questionnaires/actions/PublishQuestionnaire.vue";
import CreateDataSheet from "@/features/data_sheets/actions/CreateDataSheet.vue";
import UploadsCreateLink from "@/features/uploads/actions/CreateUploadLink.vue";
import FolderNavigationRaw, {
  ContentGroupItem,
} from "@/features/folders/components/FolderNavigationRaw.vue";
import CollabCreate from "@/features/collab/actions/CreateCollab.vue";
import FoldersAddContent from "../actions/AddContent.vue";
import { FolderDetail } from "../api/useFolder";

const props = defineProps<{
  folder: FolderDetail;
  query: () => void;
  grouping: boolean;
  selectedType: string;
  selectedId: string | number | null;
  numberOfUnreadMails?: string;
}>();

const { folder, query, numberOfUnreadMails } = toRefs(props);

const emit = defineEmits(["grouping", "selected"]);

const ungroupedButtons = computed(() => [
  h(FoldersAddContent, {
    query: query.value,
    folderUuid: folder.value.folder.uuid,
  }),
]);

const groups = computed<ContentGroupItem[]>(() => {
  const g: ContentGroupItem[] = [];

  g.push({
    name: "Data Sheets",
    type: "RECORD",
    children: folder.value.content
      .filter((c) => c.repository === "RECORD")
      .map((c) => ({ name: c.name, type: "RECORD", id: c.uuid })),
    buttons: [
      h(CreateDataSheet, {
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
    name: "Public File Uploads",
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
    name: "Mail Imports",
    type: "MAIL_IMPORTS",
    children: [],
    buttons: [],
    badge: numberOfUnreadMails.value,
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

  return g;
});
</script>

<template>
  <FolderNavigationRaw
    :groups="groups"
    :grouping="grouping"
    :ungrouped-buttons="ungroupedButtons"
    :selected-id="selectedId"
    :selected-type="selectedType"
    @selected="emit('selected', $event)"
    @grouping="emit('grouping', $event)"
  />
</template>
