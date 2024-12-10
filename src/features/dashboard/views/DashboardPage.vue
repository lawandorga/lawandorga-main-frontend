<template>
  <BoxLoader
    :show="
      !!followUps ||
      !!records ||
      !!questionnaires ||
      !!changedRecords ||
      !!articles ||
      !!members
    "
  >
    <div class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <Squares2X2Icon class="w-6 h-6" />
      </BreadcrumbsBar>
      <h1 class="text-4xl font-bold text-gray-700">Welcome {{ user?.name }}</h1>
      User: {{ user?.id }}
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div class="lg:col-span-2 xl:col-span-3">
          <div class="flex justify-between mt-8">
            <h2
              class="items-baseline text-lg font-medium leading-6 text-gray-700"
            >
              Notes from your LC
            </h2>
            <DashboardCreateNote :query="notesQuery" />
          </div>
          <div
            class="grid grid-cols-1 gap-6 mt-2 lg:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="note in notes"
              :key="note.id"
              class="px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <h3 class="mb-2 font-medium text-gray-700">
                {{ note.title }}
              </h3>
              <p
                class="text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
              >
                {{ note.note_with_links }}
              </p>
              <div class="flex justify-end gap-3 mt-2 space-x-3">
                <DashboardUpdateNote
                  :query="notesQuery"
                  :note-id="note.id"
                  :note-title="note.title"
                  :note-note="note.note"
                />
                <DashboardDeleteNote
                  :query="notesQuery"
                  :note-id="note.id"
                  :note-title="note.title"
                />
              </div>
            </article>
          </div>
        </div>
        <div v-if="records?.length">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Active Data Sheets
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li v-for="sheet in records" :key="sheet.uuid" class="block">
              <router-link
                :to="{
                  name: 'folders-detail',
                  params: { uuid: sheet.folder_uuid },
                  query: { selectedType: 'RECORD', selectedId: sheet.uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ sheet.identifier }}
                ({{ sheet.state }})
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="changedRecords?.length">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Records updated in the last 10 days
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li
              v-for="record in changedRecords"
              :key="record.uuid"
              class="block"
            >
              <router-link
                :to="{
                  name: 'folders-detail',
                  params: { uuid: record.folder_uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }}
                ({{ formatDate(record.updated) }})
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="members?.length">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            New Members in no groups
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li v-for="member in members" :key="member.id" class="block">
              <router-link
                :to="{
                  name: 'admin-profile',
                  params: { id: member.rlcuserid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ member.name }}
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="questionnaires?.length">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Questionnaires
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li
              v-for="questionnaire in questionnaires"
              :key="questionnaire.name"
              class="block"
            >
              <router-link
                :to="{
                  name: 'folders-detail',
                  params: { uuid: questionnaire.folder_uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ questionnaire.name }}
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="followUps?.length">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Follow Ups
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li
              v-for="followUp in followUps"
              :key="followUp.folder_uuid"
              class="block"
            >
              <router-link
                :to="{
                  name: 'folders-detail',
                  params: { uuid: followUp.folder_uuid },
                  query: { selectedType: 'TIMELINE' },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ followUp.title }} - {{ formatDate(followUp.time) }}
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="articles?.length" class="lg:col-span-2 xl:col-span-3">
          <div class="flex justify-between mt-8">
            <h2
              class="items-baseline text-lg font-medium leading-6 text-gray-700"
            >
              News from your LC
            </h2>
          </div>
          <div
            class="grid grid-cols-1 gap-6 mt-2 lg:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="article in articles"
              :key="article.id"
              class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <p class="text-sm text-gray-500 text-end">
                {{ new Date(article.date).toLocaleDateString() }}
              </p>
              <div>
                <h3 class="mb-2 font-medium text-gray-700">
                  {{ article.title }}
                </h3>
                <p
                  class="text-sm text-gray-700 break-words whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
                >
                  {{ article.description }}
                </p>
              </div>
              <router-link
                :to="{ name: 'internal-article', params: { id: article.id } }"
                class="ml-auto"
              >
                <ButtonNormal kind="action">Read more</ButtonNormal>
              </router-link>
            </article>
          </div>
        </div>
        <div
          v-if="user?.email === 'dummy@law-orga.de'"
          class="lg:col-span-2 xl:col-span-3"
        >
          <div class="flex justify-between mt-8 mb-4">
            <h2
              class="items-baseline text-lg font-semibold leading-6 text-gray-700"
            >
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
                  v-if="assignedTasks.tasks && assignedTasks.tasks.length"
                  class="py-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
                >
                  <article
                    v-for="task in assignedTasks.tasks"
                    :key="task?.id"
                    class="px-6 pt-4 pb-4 bg-white rounded shadow"
                  >
                    <button>
                      <div class="flex justify-between">
                        <h3 class="mb-2 font-medium text-gray-700">
                          An interesting title A1
                        </h3>
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
                <div class="py-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  <article class="px-6 pt-4 pb-4 bg-white rounded shadow">
                    <button>
                      <div class="flex justify-between">
                        <h3 class="mb-2 font-medium text-gray-700">
                          An interesting title B1
                        </h3>
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
                <div class="py-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  <article class="px-6 pt-4 pb-4 bg-white rounded shadow">
                    <button>
                      <div class="flex justify-between">
                        <h3 class="mb-2 font-medium text-gray-700">
                          An interesting title C1
                        </h3>
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
                        <ChevronUpDownIcon class="rotate-45 h-6 w-6" />
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
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Omnis, eaque sequi, labore deleniti!
                      </p>
                    </button>
                    <div class="flex justify-between mt-4 pt-2 border-t-2">
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
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import {
  FolderOpenIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/vue/24/outline";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { ButtonNormal } from "lorga-ui";
import DashboardCreateNote from "@/features/dashboard/actions/DashboardCreateNote.vue";
import DashboardDeleteNote from "@/features/dashboard/actions/DashboardDeleteNote.vue";
import DashboardUpdateNote from "@/features/dashboard/actions/DashboardUpdateNote.vue";
/*
import DashboardUpdateTodo from "@/features/dashboard/actions/DashboardUpdateTodo.vue";
import DashboardDeleteTodo from "@/features/dashboard/actions/DashboardDeleteTodo.vue";
*/
import TabControls from "@/components/TabControls.vue";
import { useNotes } from "../api/useNotes";
import { useFollowUps } from "../api/useFollowUps";
import { useRecords } from "../api/useRecords";
import { useQuestionnaires } from "../api/useQuestionnaires";
import { useChangedRecords } from "../api/useChangedRecords";
import { useArticles } from "../api/useArticles";
import { useMembers } from "../api/useMembers";
// import { useTasks } from "../api/useTasks";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { notes, notesQuery } = useNotes();

const { followUps } = useFollowUps();
const { records } = useRecords();
const { questionnaires } = useQuestionnaires();
const { changedRecords } = useChangedRecords();
const { articles } = useArticles();
const { members } = useMembers();

document.addEventListener("readystatechange", () => {
  console.log("I'm loaded");
  console.log(user.value?.id);
  console.log(user.value);
});
// const { assignedTasks, createdTasks } = useTasks(user.value?.id);
</script>
