<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Task
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Task"
      :fields="taskFields"
      submit="Create"
      :request="commandRequest"
      :data="{
        action: 'tasks/create_task',
        page_url: route.fullPath,
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { useTaskStore } from "@/features/dashboard/api/useTasks";
import { useRoute } from "vue-router";

const route = useRoute();

const createdTaskStore = useTaskStore();
const { assignedTasksQuery, createdTasksQuery } = createdTaskStore;

const { formProfiles } = useProfiles();

const taskFields = computed<types.FormField[]>(() => [
  { label: "Title", name: "title", required: true, type: "text" },
  {
    label: "Description",
    name: "description",
    required: false,
    type: "textarea",
  },
  {
    label: "Deadline",
    name: "deadline",
    required: false,
    type: "datetime-local",
  },
  {
    label: "Assignee",
    name: "assignee_id",
    required: true,
    type: "searchselect",
    options: formProfiles.value,
  },
]);

const { commandModalOpen, commandRequest } = useCmd(
  assignedTasksQuery,
  createdTasksQuery,
);
</script>
