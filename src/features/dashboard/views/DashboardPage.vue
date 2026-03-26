<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { Squares2X2Icon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { useRecords } from "../api/useRecords";
import { useChangedRecords } from "../api/useChangedRecords";
import TaskList from "../components/TaskList.vue";
import OrgNotes from "../components/OrgNotes.vue";
import SurveyPill from "../components/SurveyPill.vue";
import ArticleList from "../components/ArticleList.vue";
import QuestionnaireList from "../components/QuestionnaireList.vue";
import MembersList from "../components/MembersList.vue";
import FollowUpList from "../components/FollowUpList.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { records } = useRecords();
const { changedRecords } = useChangedRecords();
</script>

<template>
  <BoxLoader :show="!!records || !!changedRecords">
    <div class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <Squares2X2Icon class="w-6 h-6" />
      </BreadcrumbsBar>
      <h1 class="text-4xl font-bold text-gray-700">Welcome {{ user?.name }}</h1>
      <SurveyPill />
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <OrgNotes />
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
        <MembersList />
        <QuestionnaireList />
        <FollowUpList />
        <ArticleList />
        <TaskList />
      </div>
    </div>
  </BoxLoader>
</template>
