<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Task, useAssignedTasks, useCreatedTasks } from "../api/useTasks";
import { useUserStore } from "@/store/user";
import TabControls from "@/components/TabControls.vue";
import { computed, ref } from "vue";
import DashboardTask from "@/features/dashboard/components/DashboardTask.vue";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { assignedTasks } = useAssignedTasks();
const { createdTasks } = useCreatedTasks();

const assignedOpenTasks = computed<Task[]>(
  () => assignedTasks.value?.filter((task: Task) => !task.is_done) ?? [],
);

const createdOpenTasks = computed<Task[]>(
  () => createdTasks.value?.filter((task: Task) => !task.is_done) ?? [],
);

/* If the user assigns a task to themself, it's in both lists. Therefore it shows up twice in the completed tasks, which we don't want. This code filters out the duplicates. */
const completedTasks = computed<Task[]>(() => {
  const allTasks = [
    ...(assignedTasks.value?.filter((task: Task) => task.is_done) ?? []),
    ...(createdTasks.value?.filter((task: Task) => task.is_done) ?? []),
  ];

  const uniqueTasks = Array.from(
    new Map(allTasks.map((task) => [task.uuid, task])).values(),
  );

  return uniqueTasks.sort((task, nextTask) =>
    task.updated_at > nextTask.updated_at ? -1 : 1,
  );
});

const openedTaskId = ref<number | null>(null);
</script>

<template>
  <div
    v-if="user?.email === 'dummy@law-orga.de'"
    class="lg:col-span-2 xl:col-span-3"
  >
    <div class="flex justify-between mt-8 mb-4">
      <h2 class="items-baseline text-lg font-semibold leading-6 text-gray-700">
        Tasks
      </h2>
    </div>
  </div>
  <div class="lg:col-span-2 xl:col-span-3">
    <TabControls
      v-if="user?.email === 'dummy@law-orga.de'"
      :tabs="[
        { name: 'My Tasks', key: 'owntasks', highlighted: true },
        { name: 'Created Tasks', key: 'createdtasks', highlighted: true },
        { name: 'Completed Tasks', key: 'completedtasks' },
      ]"
    >
      <template #owntasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw] min-h-40"
        >
          <div
            v-if="assignedOpenTasks && assignedOpenTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <DashboardTask
              v-for="task in assignedOpenTasks"
              :key="task.uuid"
              :opened-task-id="openedTaskId"
              :task="task"
            />
          </div>
          <div v-else class="col-span-3 pt-4 text-gray-500">
            No tasks assigned to you.
          </div>
        </div>
      </template>
      <template #createdtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw] min-h-40"
        >
          <div
            v-if="createdOpenTasks && createdOpenTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <DashboardTask
              v-for="task in createdOpenTasks"
              :key="task.uuid"
              :opened-task-id="openedTaskId"
              :task="task"
            />
          </div>
          <div v-else class="col-span-3 pt-4 text-gray-500">
            No tasks created by you.
          </div>
        </div>
      </template>
      <template #completedtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw] min-h-40"
        >
          <div
            v-if="completedTasks && completedTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <DashboardTask
              v-for="task in completedTasks"
              :key="task.uuid"
              :opened-task-id="openedTaskId"
              :task="task"
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
