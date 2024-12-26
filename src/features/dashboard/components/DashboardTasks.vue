<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTasks } from "../api/useTasks";
import { useUserStore } from "@/store/user";
import TabControls from "@/components/TabControls.vue";
import { FolderOpenIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
/*
import DashboardUpdateTodo from "@/features/dashboard/actions/DashboardUpdateTodo.vue";
import DashboardDeleteTodo from "@/features/dashboard/actions/DashboardDeleteTodo.vue";
*/

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const userId = computed(() => user.value?.id);
const { assignedTasks } = useTasks(userId);
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
          {{ assignedTasks }}
          <div
            v-if="assignedTasks && assignedTasks.length"
            class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="task in assignedTasks"
              :key="task?.id"
              class="px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <button>
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    An interesting title A1
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
                    An interesting title A2
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
      <template #createdtasks>
        <div
          class="lg:col-span-2 xl:col-span-3 -mx-[50vw] bg-gray-300 px-[50vw]"
        >
          <div class="grid gap-6 py-8 lg:grid-cols-2 xl:grid-cols-3">
            <article class="px-6 pt-4 pb-4 bg-white rounded shadow">
              <button>
                <div class="flex justify-between">
                  <h3 class="mb-2 font-medium text-gray-700">
                    An interesting title B1
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
                    An interesting title B2
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
