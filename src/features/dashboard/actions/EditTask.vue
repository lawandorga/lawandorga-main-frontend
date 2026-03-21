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
  {
    name: "comments_display",
    type: "slot",
  },
  {
    label: "Add Comment",
    name: "comment",
    required: false,
    type: "textarea",
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
        deadline: task.deadline ? task.deadline.slice(0, 16) : null,
        assignee_ids: task.assignee_ids,
        priority: task.priority,
        progress: task.progress,
        tags: task.tags_as_list,
        comment: '',
      }"
    >
      <template #custom>Created by: {{ task.creator_name }}</template>
      <template #comments_display>
        <div v-if="task.comments && task.comments.length" class="mb-2">
          <h4 class="mb-2 text-sm font-semibold text-gray-700">Comments</h4>
          <div class="space-y-2 overflow-y-auto max-h-48">
            <div
              v-for="(c, index) in task.comments"
              :key="index"
              class="py-1 pl-3 text-sm border-l-2 border-gray-300"
            >
              <span class="font-semibold text-gray-600">{{ c.email }}</span>
              <p class="text-gray-700 mt-0.5">{{ c.comment }}</p>
            </div>
          </div>
        </div>
      </template>
    </ModalUpdate>
  </ButtonNormal>
</template>
