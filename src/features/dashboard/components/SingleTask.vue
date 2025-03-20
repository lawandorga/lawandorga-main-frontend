<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { Task } from "../api/useTasks";
import useCmd from "@/composables/useCmd";

import { useTaskStore } from "@/features/dashboard/api/useTasks";
import {
  CheckIcon,
  ChevronUpDownIcon,
  FolderOpenIcon,
  PencilIcon,
  XMarkIcon,
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
const editingDueDate = ref(false);
const newDueDate = ref<string | null>(task.value.deadline);
const editingDescription = ref(false);
const newDescription = ref<string | null>(task.value.description);

function formatDateTime(date: Date) {
  const zeroPad = (input: number) => input.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = zeroPad(date.getMonth() + 1);
  const day = zeroPad(date.getDate());
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

watch(editingDueDate, () => {
  if (!newDueDate.value) {
    newDueDate.value = formatDateTime(new Date());
  } else {
    newDueDate.value = formatDateTime(new Date(newDueDate.value));
  }
});

const saveTask = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: newTitle.value,
    deadline: newDueDate.value,
    description: newDescription.value,
  });
  editingTitle.value = false;
  editingDueDate.value = false;
};

const formatDate = (date: string) => {
  const formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formatter.format(new Date(date));
};
</script>

<template>
  <article
    class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
  >
    <button class="w-full" @click="commandModalOpen = true">
      <div class="flex justify-between">
        <h3 class="text-left mb-2 font-medium text-gray-700">
          {{ task.title }}
        </h3>
        <ChevronUpDownIcon class="w-12 h-12 rotate-45 relative bottom-3" />
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
      <p
        class="content-center text-sm text-gray-500"
        :class="{
          'text-red-500': task.deadline && new Date(task.deadline) < new Date(),
        }"
      >
        Due on {{ formatDate(task.deadline) }}
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
          <TableData>
            <div class="flex items-center gap-2">
              <input
                v-if="editingDueDate"
                v-model="newDueDate"
                class="w-full p-2 border border-gray-300 border-solid rounded"
                type="datetime-local"
              />
              <h3 v-else-if="newDueDate" class="text-gray-700">
                {{ formatDate(newDueDate) }}
              </h3>
              <h3 v-else>No due date</h3>
              <button @click="editingDueDate = !editingDueDate">
                <CheckIcon v-if="editingDueDate" class="w-4 h-4 stroke-2" />
                <PencilIcon v-else class="w-4 h-4 stroke-2" />
              </button>
              <button v-if="newDueDate" @click="newDueDate = null">
                <XMarkIcon class="w-5 h-5 stroke-2" />
              </button>
            </div>
          </TableData>
        </TableRow>
        <TableRow>
          <TableHeader class="w-1/4 border-r border-solid">
            Created by
          </TableHeader>
          <TableData>{{ task.creator_name }}</TableData>
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
          <TableData>
            <div class="flex items-center gap-2">
              <textarea
                v-if="editingDescription"
                v-model="newDescription"
                rows="4"
                class="w-full p-2 border text-gray-700 border-solid rounded"
              ></textarea>
              <h3 v-else class="text-gray-700">
                {{ newDescription }}
              </h3>
              <button @click="editingDescription = !editingDescription">
                <CheckIcon v-if="editingDescription" class="w-4 h-4 stroke-2" />
                <PencilIcon v-else class="w-4 h-4 stroke-2" />
              </button>
            </div>
          </TableData>
        </TableRow>
      </TableBody>
    </TableTable>
    <div class="flex justify-end gap-2 mt-4">
      <ButtonNormal @click="saveTask">Save</ButtonNormal>
    </div>
  </ModalFree>
</template>
