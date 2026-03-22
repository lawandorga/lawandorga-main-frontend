<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { Task } from "@/features/dashboard/api/useTasks";
import { formatDate } from "@/utils/date";
import { ButtonNormal, types, ModalFree, FormGenerator } from "lorga-ui";
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
]);

const { commandModalOpen, commandRequest } = useCmd(props.query);
const { commandRequest: commandRequestThatDoesNotCloseModal } = useCmd(
  props.query,
);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
    <ModalFree v-model="commandModalOpen" title="Update Task" width="max-w-3xl">
      <FormGenerator
        :request="commandRequest"
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
        }"
      >
        <template #custom>Created by: {{ task.creator_name }}</template>
      </FormGenerator>
      <FormGenerator
        :request="commandRequestThatDoesNotCloseModal"
        :fields="[
          {
            name: 'comments_display',
            type: 'slot',
          },
          {
            label: 'Add Comment',
            name: 'comment',
            required: false,
            type: 'textarea',
          },
        ]"
        :data="{
          action: 'tasks/add_comment',
          task_id: task.uuid,
          comment: '',
        }"
        submit="Add Comment"
      >
        <template #comments_display>
          <div v-if="task.comments && task.comments.length" class="mb-2">
            <h4 class="mb-2 text-sm font-semibold text-gray-700">Comments</h4>
            <div class="space-y-2 overflow-y-auto">
              <div
                v-for="(c, index) in task.comments"
                :key="index"
                class="py-1 pl-3 text-sm border-l-2 border-gray-300"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <span class="font-semibold text-gray-600">{{
                    c.name || c.email
                  }}</span>
                  <span v-if="c.date" class="text-xs text-gray-500">{{
                    formatDate(c.date)
                  }}</span>
                </div>
                <p class="text-gray-700 mt-0.5">{{ c.comment }}</p>
              </div>
            </div>
          </div>
        </template>
      </FormGenerator>
    </ModalFree>
  </ButtonNormal>
</template>
