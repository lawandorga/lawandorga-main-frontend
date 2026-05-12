<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import { useQuestionnaires } from "../api/useQuestionnaires";

const { questionnaires } = useQuestionnaires();
</script>

<template>
  <div v-if="questionnaires?.length">
    <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
      Questionnaires
    </h2>
    <ul class="mt-2 space-y-1 rounded bg-white p-1 shadow">
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
          class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
        >
          {{ questionnaire.name }}
          <div
            class="absolute top-0 right-0 bottom-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
          >
            <ChevronRightIcon class="mr-1.5 h-6 w-6 text-gray-300" />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
