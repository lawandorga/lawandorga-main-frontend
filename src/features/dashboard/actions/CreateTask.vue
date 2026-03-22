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
        priority: 'medium',
        progress: 0,
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { notifyTasksChanged } from "@/features/dashboard/api/useTasksChanged";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { useRoute } from "vue-router";

const route = useRoute();

const { formProfiles } = useProfiles();

const taskFields = computed<types.FormField[]>(() => [
  { label: "Location", name: "page_url", type: "text" },
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
    label: "Assignees",
    name: "assignee_ids",
    required: true,
    type: "multiple",
    options: formProfiles.value,
  },
  {
    label: "Priority",
    name: "priority",
    required: true,
    type: "select",
    options: [
      { name: "Low", value: "low" },
      { name: "Medium", value: "medium" },
      { name: "High", value: "high" },
      { name: "Urgent", value: "urgent" },
    ],
  },
  {
    label: "Progress",
    name: "progress",
    required: true,
    type: "slider",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },
  {
    label: "Tags",
    name: "tags",
    required: false,
    type: "list",
  },
]);

const { commandModalOpen, commandRequest } = useCmd(notifyTasksChanged);
</script>
