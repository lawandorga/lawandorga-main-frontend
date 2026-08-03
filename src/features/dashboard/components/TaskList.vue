<script setup lang="ts">
import { watch } from "vue";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
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
  <BoxSection
    title="Tasks"
    :number-of-items="sortTasks(assignedOpenTasks)?.length"
  >
    <BoxLoader :show="!!sortTasks(assignedOpenTasks)" class="px-6 py-4">
      <div>
        <TabControls
          :tabs="[
            { name: 'My Tasks', key: 'owntasks' },
            { name: 'Created Tasks', key: 'createdtasks' },
            { name: 'Completed Tasks', key: 'completedtasks' },
          ]"
        >
          <template #owntasks>
            <div class="mx-[-50vw] min-h-40 px-[50vw]">
              <div
                v-if="assignedOpenTasks && assignedOpenTasks.length"
                class="grid gap-6 py-8 2xl:grid-cols-2"
              >
                <SingleTask
                  v-for="task in sortTasks(assignedOpenTasks)"
                  :key="task.uuid"
                  :task="task"
                  :query="query"
                />
              </div>
              <div v-else class="pt-4 text-gray-500">
                No tasks assigned to you.
              </div>
            </div>
          </template>
          <template #createdtasks>
            <div class="bg-gray mx-[-50vw] min-h-40 px-[50vw]">
              <div
                v-if="createdOpenTasks && createdOpenTasks.length"
                class="grid gap-6 py-8 2xl:grid-cols-2"
              >
                <SingleTask
                  v-for="task in sortTasks(createdOpenTasks)"
                  :key="task.uuid"
                  :task="task"
                  :query="query"
                />
              </div>
              <div v-else class="pt-4 text-gray-500">
                No tasks created by you.
              </div>
            </div>
          </template>
          <template #completedtasks>
            <div class="mx-[-50vw] min-h-40 px-[50vw]">
              <div
                v-if="completedTasks"
                class="grid gap-6 py-8 2xl:grid-cols-2"
              >
                <SingleTask
                  v-for="task in completedTasks"
                  :key="task.uuid"
                  :task="task"
                  :query="query"
                />
              </div>
              <div v-else class="pt-4 text-gray-500">No completed tasks.</div>
            </div>
          </template>
        </TabControls>
      </div>
    </BoxLoader>
  </BoxSection>
</template>
