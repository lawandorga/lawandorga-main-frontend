<script setup lang="ts">
import {
  ExclamationCircleIcon,
  FolderOpenIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import EditTask from "@/features/dashboard/actions/EditTask.vue";
import { formatDate } from "@/utils/date";

import DeleteTask from "../actions/DeleteTask.vue";
import { Task } from "../api/useTasks";

const props = defineProps<{
  task: Task;
  query: () => void;
}>();

const { task } = toRefs(props);

const { commandRequest } = useCmd(props.query);

const markAsDone = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: task.value.title,
    description: task.value.description,
    assignee_ids: task.value.assignee_ids,
    progress: 100,
    deadline: task.value.deadline,
  });
};

const markAsUndone = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: task.value.title,
    description: task.value.description,
    assignee_ids: task.value.assignee_ids,
    progress: 0,
    deadline: task.value.deadline,
  });
};

const priorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const priorityColor: Record<string, string> = {
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-orange-500",
  urgent: "text-red-600",
};
</script>

<template>
  <article
    class="flex flex-col justify-between rounded bg-white px-6 pt-4 pb-4 shadow"
  >
    <div>
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-formcolor mb-2 text-left font-semibold">
          {{ task.title }}
        </h3>
        <EditTask v-if="!task.is_done" :task="task" :query="query" />
        <DeleteTask v-if="task.is_done" :task="task" :query="query" />
      </div>
      <p
        v-if="task.page_url"
        class="flex text-sm wrap-break-word whitespace-pre-line text-gray-700"
      >
        <FolderOpenIcon class="h-6 w-6 shrink-0 grow-0" />
        <a :href="task.page_url" class="ml-2 underline">
          {{ task.page_url }}
        </a>
      </p>
      <p
        class="mt-2 text-sm font-semibold wrap-break-word whitespace-pre-line text-gray-700"
      >
        {{ task.description }}
      </p>
      <p v-if="task.assignee_names.length" class="mt-2 text-sm text-gray-500">
        Assignees: {{ task.assignee_names.join(", ") }}
      </p>
      <div v-if="task.tags_as_list.length" class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="tag in task.tags_as_list"
          :key="tag"
          class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-3">
        <p
          class="text-sm font-semibold"
          :class="priorityColor[task.priority] || 'text-gray-500'"
        >
          {{ priorityLabel[task.priority] || task.priority }}
        </p>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <div class="h-2 w-24 rounded-full bg-gray-200">
            <div
              class="h-2 rounded-full"
              :class="task.progress === 100 ? 'bg-green-500' : 'bg-formcolor'"
              :style="{ width: task.progress + '%' }"
            />
          </div>
          <span>{{ task.progress }}%</span>
        </div>
      </div>
    </div>
    <div class="mt-4 flex border-t-2 pt-2">
      <p
        v-if="task.deadline"
        class="flex items-center gap-1 text-sm font-semibold text-gray-500"
        :class="{
          'text-red-500':
            task.deadline &&
            new Date(task.deadline) < new Date() &&
            !task.is_done,
        }"
      >
        <ExclamationCircleIcon
          v-if="new Date(task.deadline) < new Date() && !task.is_done"
          class="w-4"
        />
        {{ formatDate(task.deadline, true) }}
      </p>
      <div class="ml-auto">
        <ButtonNormal
          kind="action"
          class="mt-1"
          @click="task.is_done ? markAsUndone() : markAsDone()"
        >
          {{ task.is_done ? "Mark as not done" : "Mark as done" }}
        </ButtonNormal>
      </div>
    </div>
  </article>
</template>
