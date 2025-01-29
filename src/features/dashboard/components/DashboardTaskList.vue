<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAssignedTasks, useCreatedTasks } from "../api/useTasks";
import { useUserStore } from "@/store/user";
import TabControls from "@/components/TabControls.vue";
import { ref } from "vue";
import DashboardTask from "@/features/dashboard/components/DashboardTask.vue";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { assignedTasks } = useAssignedTasks();
const { createdTasks } = useCreatedTasks();

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
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw]"
        >
          <div
            v-if="assignedTasks && assignedTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <DashboardTask
              v-for="task in assignedTasks"
              :key="task.id"
              :opened-task-id="openedTaskId"
              :task="task"
            />
          </div>
        </div>
      </template>
      <template #createdtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw]"
        >
          <div
            v-if="createdTasks && createdTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <DashboardTask
              v-for="task in createdTasks"
              :key="task.id"
              :opened-task-id="openedTaskId"
              :task="task"
            />
          </div>
        </div>
      </template>
      <template #completedtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw]"
        >
          <div class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3">
            To do here: Filter own tasks for completed and display them
          </div>
        </div>
      </template>
    </TabControls>
  </div>
</template>
