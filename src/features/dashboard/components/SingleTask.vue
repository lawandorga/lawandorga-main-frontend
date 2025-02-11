<script setup lang="ts">
import { toRefs } from "vue";
import { Task } from "../api/useTasks";

import { FolderOpenIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  task: Task;
  openedTaskId: number | null;
}>();
const { task } = toRefs(props);
</script>

<template>
  <article
    class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
  >
    <button class="w-full" onclick="openedTaskId = task?.id">
      <div class="flex justify-between">
        <h3 class="mb-2 font-medium text-gray-700">
          {{ task.title }}
        </h3>
        <ChevronUpDownIcon class="w-6 h-6 rotate-45" />
      </div>
      <p
        v-if="task.page_url"
        class="flex items-center text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
      >
        <FolderOpenIcon class="w-6 h-6" />
        <a href="" class="ml-2 underline">{{ task.page_url }}</a>
      </p>
      <p
        class="text-sm mt-2 text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor text-left"
      >
        {{ task.description }}
      </p>
    </button>
    <div class="flex justify-between pt-2 mt-4 border-t-2">
      <p class="content-center text-sm text-gray-500">
        Due on {{ new Date(task.deadline).toLocaleString() }}
      </p>
    </div>
  </article>
</template>
