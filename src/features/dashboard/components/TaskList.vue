<script setup lang="ts">
import { watch } from "vue";

import TabControls from "@/components/TabControls.vue";
import SingleTask from "@/features/dashboard/components/SingleTask.vue";

import { Task, useTasks } from "../api/useTasks";
import { useTasksChanged } from "../api/useTasksChanged";

const { completedTasks, assignedOpenTasks, createdOpenTasks, query } =
  useTasks();

const { tasksChanged } = useTasksChanged();
watch(tasksChanged, () => query());

const sortTasks = (tasks: Task[]) =>
  tasks.sort((task, nextTask) =>
    task.updated_at > nextTask.updated_at ? -1 : 1,
  );
</script>

<template>
  <div class="lg:col-span-2 xl:col-span-3">
    <div class="mt-8 mb-4 flex justify-between">
      <h2 class="items-baseline text-lg leading-6 font-semibold text-gray-700">
        Tasks
      </h2>
    </div>
  </div>
  <div class="lg:col-span-2 xl:col-span-3">
    <TabControls
      :tabs="[
        { name: 'My Tasks', key: 'owntasks', highlighted: true },
        { name: 'Created Tasks', key: 'createdtasks', highlighted: true },
        { name: 'Completed Tasks', key: 'completedtasks' },
      ]"
    >
      <template #owntasks>
        <div
          class="mx-[-50vw] min-h-40 bg-gray-300 px-[50vw] lg:col-span-2 xl:col-span-3"
        >
          <div
            v-if="assignedOpenTasks && assignedOpenTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <SingleTask
              v-for="task in sortTasks(assignedOpenTasks)"
              :key="task.uuid"
              :task="task"
              :query="query"
            />
          </div>
          <div v-else class="col-span-3 pt-4 text-gray-500">
            No tasks assigned to you.
          </div>
        </div>
      </template>
      <template #createdtasks>
        <div
          class="mx-[-50vw] min-h-40 bg-gray-300 px-[50vw] lg:col-span-2 xl:col-span-3"
        >
          <div
            v-if="createdOpenTasks && createdOpenTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <SingleTask
              v-for="task in sortTasks(createdOpenTasks)"
              :key="task.uuid"
              :task="task"
              :query="query"
            />
          </div>
          <div v-else class="col-span-3 pt-4 text-gray-500">
            No tasks created by you.
          </div>
        </div>
      </template>
      <template #completedtasks>
        <div
          class="mx-[-50vw] min-h-40 bg-gray-300 px-[50vw] lg:col-span-2 xl:col-span-3"
        >
          <div
            v-if="completedTasks"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <SingleTask
              v-for="task in completedTasks"
              :key="task.uuid"
              :task="task"
              :query="query"
            />
          </div>
          <div v-else class="col-span-3 pt-4 text-gray-500">
            No completed tasks.
          </div>
        </div>
      </template>
    </TabControls>
  </div>
</template>
