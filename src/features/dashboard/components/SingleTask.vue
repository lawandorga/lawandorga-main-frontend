<script setup lang="ts">
import { toRefs } from "vue";
import { Task } from "../api/useTasks";
import useCmd from "@/composables/useCmd";

import { useTaskStore } from "@/features/dashboard/api/useTasks";
import { FolderOpenIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import {
  ModalFree,
  TableTable,
  TableRow,
  TableData,
  TableBody,
  TableHeader,
} from "lorga-ui";

const props = defineProps<{
  task: Task;
}>();
const { task } = toRefs(props);

const createdTaskStore = useTaskStore();
const { assignedTasksQuery, createdTasksQuery } = createdTaskStore;
const { commandModalOpen, commandRequest } = useCmd(
  assignedTasksQuery,
  createdTasksQuery,
);
console.log(commandRequest);
</script>

<template>
  <article
    class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
  >
    <button class="w-full" @click="commandModalOpen = true">
      <div class="flex justify-between">
        <h3 class="mb-2 font-medium text-gray-700">
          {{ task.title }}
        </h3>
        <ChevronUpDownIcon class="w-6 h-6 rotate-45" />
      </div>
    </button>
    <p
      v-if="task.page_url"
      class="flex items-center text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
    >
      <FolderOpenIcon class="w-6 h-6" />
      <a :href="task.page_url" class="ml-2 underline">
        {{ task.page_url }}
      </a>
    </p>
    <p
      class="text-sm mt-2 text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor text-left"
    >
      {{ task.description }}
    </p>
    <div v-if="task.deadline" class="flex justify-between pt-2 mt-4 border-t-2">
      <p class="content-center text-sm text-gray-500">
        Due on {{ new Date(task.deadline).toLocaleString() }}
      </p>
    </div>
  </article>
  <ModalFree
    v-model="commandModalOpen"
    :title="`Update ${task.title}`"
    width="max-w-screen-md"
  >
    <TableTable>
      <TableBody>
        <TableRow class="border-t border-solid">
          <TableHeader class="w-1/4 border-r border-solid">Case ID</TableHeader>
          <TableData>
            <FolderOpenIcon class="w-6 h-6" />
            <a href="" class="ml-2 underline">{{ task.page_url }}</a>
          </TableData>
        </TableRow>
        <TableRow>
          <TableHeader class="w-1/4 border-r border-solid">Due on</TableHeader>
          <TableData>Ich bin das vierte</TableData>
        </TableRow>
        <TableRow>
          <TableHeader class="w-1/4 border-r border-solid">
            Created by
          </TableHeader>
          <TableData>Ich bin das vierte</TableData>
        </TableRow>
        <TableRow>
          <TableHeader class="w-1/4 border-r border-solid">
            Assigned to
          </TableHeader>
          <TableData>Ich bin das vierte</TableData>
        </TableRow>
        <TableRow>
          <TableHeader class="w-1/4 border-r border-solid font-bold">
            Notes
          </TableHeader>
          <TableData>Ich bin das vierte</TableData>
        </TableRow>
      </TableBody>
    </TableTable>
  </ModalFree>
</template>
