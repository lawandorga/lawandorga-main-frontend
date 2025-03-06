<script setup lang="ts">
import { ref, toRefs } from "vue";
import { Task } from "../api/useTasks";
import useCmd from "@/composables/useCmd";

import { useTaskStore } from "@/features/dashboard/api/useTasks";
import {
  CheckIcon,
  ChevronUpDownIcon,
  FolderOpenIcon,
  PencilIcon,
} from "@heroicons/vue/24/outline";
import {
  ButtonNormal,
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

const editingTitle = ref(false);
const newTitle = ref(task.value.title);

const saveTask = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: newTitle.value,
  });
  editingTitle.value = false;
};
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
    width="max-w-screen-md"
    title="Update Task"
  >
    <TableTable>
      <TableBody>
        <TableRow class="border-t border-solid">
          <TableHeader class="w-1/4 border-r border-solid">
            Task name
          </TableHeader>
          <TableData>
            <div class="flex items-center gap-2">
              <input
                v-if="editingTitle"
                v-model="newTitle"
                class="w-full p-2 border border-gray-300 border-solid rounded"
              />
              <h3 v-else class="font-medium text-gray-700">{{ newTitle }}</h3>
              <button @click="editingTitle = !editingTitle">
                <CheckIcon v-if="editingTitle" class="w-4 h-4 stroke-2" />
                <PencilIcon v-else class="w-4 h-4 stroke-2" />
              </button>
            </div>
          </TableData>
        </TableRow>
        <TableRow class="border-t border-solid">
          <TableHeader class="w-1/4 border-r border-solid">Case ID</TableHeader>
          <TableData>
            <a :href="task.page_url" class="flex">
              <FolderOpenIcon class="w-6 h-6" />
              <span class="ml-2 underline">{{ task.page_url }}</span>
            </a>
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
          <TableHeader class="w-1/4 font-bold border-r border-solid">
            Notes
          </TableHeader>
          <TableData>Ich bin das vierte</TableData>
        </TableRow>
      </TableBody>
    </TableTable>
    <div class="flex justify-end gap-2 mt-4">
      <ButtonNormal @click="saveTask">Save</ButtonNormal>
    </div>
  </ModalFree>
</template>
