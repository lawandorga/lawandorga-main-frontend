<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { Task } from "../api/useTasks";
import useCmd from "@/composables/useCmd";

import { useTaskStore } from "@/features/dashboard/api/useTasks";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon,
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
import { useProfiles } from "@/features/admin/api/useProfiles";

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
const newDueDate = ref<string | undefined>(task.value.deadline);
const editingAssignee = ref(false);
const newAssigneeName = ref<string | undefined>(task.value.assignee_name);
const newAssigneeId = ref<number | undefined>(task.value.assignee_id);
const editingDescription = ref(false);
const newDescription = ref<string | undefined>(task.value.description);

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
    description: newDescription.value,
    assignee_id: newAssigneeId.value,
    deadline: newDueDate.value,
  });
  editingTitle.value = false;
  editingDueDate.value = false;
};

const markAsDone = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: newTitle.value,
    description: newDescription.value,
    assignee_id: newAssigneeId.value,
    is_done: true,
    deadline: newDueDate.value,
  });
};

const markAsUndone = () => {
  commandRequest({
    action: "tasks/update_task",
    task_id: task.value.uuid,
    title: newTitle.value,
    description: newDescription.value,
    assignee_id: newAssigneeId.value,
    is_done: false,
    deadline: newDueDate.value,
  });
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

const formatDateShort = (date: string) => {
  const formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return formatter.format(new Date(date));
};

const { formProfiles } = useProfiles();

watch(newAssigneeId, () => {
  newAssigneeName.value = formProfiles.value.find(
    (profile) => profile.value === newAssigneeId.value,
  )?.name;
});
</script>

<template>
  <article
    class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
  >
    <div>
      <button class="w-full" @click="commandModalOpen = true">
        <div class="flex justify-between">
          <h3 class="text-left mb-2 font-semibold text-formcolor">
            {{ task.title }}
          </h3>
          <ChevronUpDownIcon
            class="flex-grow-0 flex-shrink-0 w-6 h-6 rotate-45 relative"
          />
        </div>
      </button>
      <p
        v-if="task.page_url"
        class="flex text-sm text-gray-700 break-words whitespace-pre-line"
      >
        <FolderOpenIcon class="w-6 h-6 flex-grow-0 flex-shrink-0" />
        <a :href="task.page_url" class="ml-2 underline">
          {{ task.page_url }}
        </a>
      </p>
      <p
        class="text-sm mt-2 text-gray-700 break-words whitespace-pre-line font-semibold"
      >
        {{ task.description }}
      </p>
    </div>
    <div class="flex pt-2 mt-4 border-t-2">
      <p
        v-if="task.deadline"
        class="text-sm text-gray-500 font-semibold flex gap-1 items-center"
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
        {{ formatDateShort(task.deadline) }}
      </p>
      <div class="ml-auto">
        <a
          class="block cursor-pointer font-semibold"
          @click="task.is_done ? markAsUndone() : markAsDone()"
        >
          {{ task.is_done ? "Mark as not done" : "Mark as done" }}
        </a>
      </div>
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
              <span v-else-if="newDueDate" class="text-gray-700">
                {{ formatDate(newDueDate) }}
              </span>
              <span v-else>No due date</span>
              <button @click="editingDueDate = !editingDueDate">
                <CheckIcon v-if="editingDueDate" class="w-4 h-4 stroke-2" />
                <PencilIcon v-else class="w-4 h-4 stroke-2" />
              </button>
              <button v-if="newDueDate" @click="newDueDate = undefined">
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
          <TableData>
            <div class="flex items-center gap-2">
              <select
                v-if="editingAssignee"
                v-model="newAssigneeId"
                class="block w-full py-2 pl-3 pr-6 placeholder-gray-400 bg-no-repeat border border-gray-300 rounded-md shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-formcolor focus:border-formcolor focus:ring-1 sm:text-sm"
              >
                <option
                  v-for="option in formProfiles"
                  :key="option.name"
                  :value="option.value"
                >
                  {{ option.name }}
                </option>
              </select>
              <span v-else class="text-gray-700">
                {{ newAssigneeName }}
              </span>
              <button @click="editingAssignee = !editingAssignee">
                <CheckIcon v-if="editingAssignee" class="w-4 h-4 stroke-2" />
                <PencilIcon v-else class="w-4 h-4 stroke-2" />
              </button>
            </div>
          </TableData>
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
              <span v-else class="text-gray-700">
                {{ newDescription }}
              </span>
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
      <ButtonNormal
        kind="secondary"
        @click="task.is_done ? markAsUndone() : markAsDone()"
      >
        {{ task.is_done ? "Mark as not done" : "Mark as done" }}
      </ButtonNormal>
      <ButtonNormal @click="saveTask">Save</ButtonNormal>
    </div>
  </ModalFree>
</template>
