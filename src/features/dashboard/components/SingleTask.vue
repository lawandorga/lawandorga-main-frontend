<script setup lang="ts">
import {
  ExclamationCircleIcon,
  FolderOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

import NewBadge from "@/components/NewBadge.vue";
import useCmd from "@/composables/useCmd";
import UpdateTask from "@/features/dashboard/actions/UpdateTask.vue";
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
  low: "rounded-md border border-blue-200 px-2 py-0.5 bg-blue-100 text-blue-800",
  medium:
    "rounded-md border border-yellow-200 px-2 py-0.5 bg-yellow-100 text-yellow-800",
  high: "rounded-md border border-orange-200 px-2 py-0.5 bg-orange-100 text-orange-800",
  urgent:
    "rounded-md border border-red-200 px-2 py-0.5 bg-red-100 text-red-800",
};
</script>

<template>
  <article
    class="hover:border-formcolor/20 relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow transition-all duration-200 hover:shadow-md"
  >
    <div>
      <div class="grid grid-cols-2 justify-between gap-3">
        <h3 class="text-formcolor mb-2 text-left font-semibold">
          {{ task.title }}
          <NewBadge v-if="task.is_new" />
        </h3>
        <div class="flex items-center justify-end gap-2">
          <UpdateTask
            kind="outline"
            v-if="!task.is_done"
            :task="task"
            :query="query"
          />
          <DeleteTask v-if="task.is_done" :task="task" :query="query" />
          <ButtonNormal
            kind="primary"
            @click="task.is_done ? markAsUndone() : markAsDone()"
          >
            <CheckCircleIcon class="mr-1 h-4 w-4" v-if="!task.is_done" />
            {{ task.is_done ? "Not done" : "Done" }}
          </ButtonNormal>
        </div>
      </div>
      <p
        class="my-2 text-sm wrap-break-word whitespace-pre-line text-gray-700"
        v-html="task.description"
      />
      <p
        v-if="task.page_url"
        class="mt-2 flex text-xs wrap-break-word whitespace-pre-line text-gray-700"
      >
        <FolderOpenIcon class="h-4 w-4 shrink-0 grow-0" />
        <a :href="task.page_url" class="ml-1 underline">
          {{ task.page_url }}
        </a>
      </p>
      <div class="my-2 flex justify-between">
        <div>
          <p class="text-xs">Assignees:</p>
          <p
            v-if="task.assignee_names.length"
            class="mt-2 text-sm text-gray-500"
          >
            {{ task.assignee_names.join(", ") }}
          </p>
        </div>
        <div class="basis-2/3">
          <p class="text-xs">Progress:</p>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <div class="h-2 w-full rounded-full bg-gray-200">
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
    </div>

    <div class="mt-4 flex justify-between border-t-2 border-gray-200 pt-2">
      <div class="mt-2 flex items-center gap-3">
        <p
          class="text-sm font-semibold"
          :class="priorityColor[task.priority] || 'text-gray-500'"
        >
          {{ priorityLabel[task.priority] || task.priority }}
        </p>

        <p
          v-if="task.deadline"
          class="flex items-center gap-1 text-sm font-semibold text-red-500"
        >
          <ExclamationCircleIcon v-if="!task.is_done" class="w-4" />
          <CalendarIcon class="w-4" />
          {{ formatDate(task.deadline, true) }}
        </p>
      </div>
      <div v-if="task.tags_as_list.length" class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="tag in task.tags_as_list"
          :key="tag"
          class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>
