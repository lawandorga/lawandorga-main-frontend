<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAssignedTasks, useCreatedTasks } from "../api/useTasks";
import { useUserStore } from "@/store/user";
import TabControls from "@/components/TabControls.vue";
import { FolderOpenIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
/*
import DashboardUpdateTodo from "@/features/dashboard/actions/DashboardUpdateTodo.vue";
import DashboardDeleteTodo from "@/features/dashboard/actions/DashboardDeleteTodo.vue";
*/

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { assignedTasks, assignedTasksQuery } = useAssignedTasks();
const { createdTasks, createdTasksQuery } = useCreatedTasks();

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
            <article
              v-for="task in assignedTasks"
              :key="task?.id"
              class="px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <button class="w-full" onclick="openedTaskId = task?.id">
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    {{ task?.title }}
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
              <DashboardUpdateTodo v-if="openedTaskId === task.id" />
            </article>
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
            <article
              v-for="task in createdTasks"
              :key="task?.id"
              class="px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <button class="w-full" onclick="openedTaskId = task?.id">
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    {{ task?.title }}
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
              <DashboardUpdateTodo v-if="openedTaskId === task.id" />
            </article>
          </div>
        </div>
      </template>
      <template #completedtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw]"
        >
          <div class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3">
            <article class="px-6 pt-4 pb-4 bg-white rounded shadow">
              <button>
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    An interesting title C1
                  </h3>
                  <ChevronUpDownIcon class="w-6 h-6 rotate-45" />
                </div>
                <p
                  class="flex items-center text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
                >
                  <FolderOpenIcon class="w-6 h-6" />
                  <a href="" class="ml-2 underline">UUID 1234567890</a>
                </p>
                <p
                  class="text-sm mt-2 text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor text-left"
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Omnis, eaque sequi, labore deleniti!
                </p>
              </button>
              <div class="flex justify-between pt-2 mt-4 border-t-2">
                <p class="content-center text-sm text-gray-500">
                  21. September 2024
                </p>
                <!--<DashboardUpdateTodo />-->
              </div>
            </article>
            <article class="px-6 pt-4 pb-4 bg-white rounded shadow">
              <button>
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    An interesting title C2
                  </h3>
                  <ChevronUpDownIcon class="w-6 h-6 rotate-45" />
                </div>
                <p
                  class="flex items-center text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
                >
                  <FolderOpenIcon class="w-6 h-6" />
                  <a href="" class="ml-2 underline">UUID 1234567890</a>
                </p>
                <p
                  class="text-sm mt-2 text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor text-left"
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Omnis, eaque sequi, labore deleniti!
                </p>
              </button>
              <div class="flex justify-between pt-2 mt-4 border-t-2">
                <p class="content-center text-sm text-gray-500">
                  21. September 2024
                </p>
                <!--<DashboardUpdateTodo />-->
              </div>
            </article>
          </div>
        </div>
      </template>
    </TabControls>
  </div>
</template>
