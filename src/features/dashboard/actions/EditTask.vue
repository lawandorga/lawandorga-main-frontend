<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { Task } from "@/features/dashboard/api/useTasks";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  task: Task;
  query: () => void;
}>();

const { task } = toRefs(props);

const { formProfiles } = useProfiles();

const taskFields = computed<types.FormField[]>(() => [
  {
    name: "custom",
    type: "slot",
  },
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
    type: "select",
    options: formProfiles.value,
  },
]);

const { commandModalOpen, commandRequest } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
    <ModalUpdate
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Update Task"
      width="max-w-3xl"
      :fields="taskFields"
      :data="{
        action: 'tasks/update_task',
        task_id: task.uuid,
        title: task.title,
        description: task.description,
        deadline: task.deadline || undefined,
        assignee_id: task.assignee_id,
      }"
    >
      <template #custom>Created by: {{ task.creator_name }}</template>
    </ModalUpdate>
  </ButtonNormal>
</template>
