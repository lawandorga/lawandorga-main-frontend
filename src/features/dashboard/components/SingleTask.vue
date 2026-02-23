<script setup lang="ts">
import { toRefs } from "vue";
import { Task } from "../api/useTasks";
import useCmd from "@/composables/useCmd";
import {
  ExclamationCircleIcon,
  FolderOpenIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";
import { formatDate } from "@/utils/date";
import EditTask from "@/features/dashboard/actions/EditTask.vue";
import DeleteTask from "../actions/DeleteTask.vue";

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
    assignee_id: task.value.assignee_id,
    is_done: true,
    deadline: task.value.deadline,
  });
};

const markAsUndone = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: task.value.title,
    description: task.value.description,
    assignee_id: task.value.assignee_id,
    is_done: false,
    deadline: task.value.deadline,
  });
};
</script>

<template>
  <article
    class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
  >
    <div>
      <div class="flex items-start justify-between gap-3">
        <h3 class="mb-2 font-semibold text-left text-formcolor">
          {{ task.title }}
        </h3>
        <EditTask v-if="!task.is_done" :task="task" :query="query" />
        <DeleteTask v-if="task.is_done" :task="task" :query="query" />
      </div>
      <p
        v-if="task.page_url"
        class="flex text-sm text-gray-700 whitespace-pre-line wrap-break-word"
      >
        <FolderOpenIcon class="w-6 h-6 grow-0 shrink-0" />
        <a :href="task.page_url" class="ml-2 underline">
          {{ task.page_url }}
        </a>
      </p>
      <p
        class="mt-2 text-sm font-semibold text-gray-700 whitespace-pre-line wrap-break-word"
      >
        {{ task.description }}
      </p>
    </div>
    <div class="flex pt-2 mt-4 border-t-2">
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
