<script setup lang="ts">
import BoxSection from "@/components/BoxSection.vue";
import { useQuestionnaires } from "../api/useQuestionnaires";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

const { questionnaires } = useQuestionnaires();
</script>

<template>
  <BoxSection title="Questionnaires" :length="questionnaires?.length">
    <div v-if="questionnaires?.length">
      <ul class="p-1 mt-2 space-y-1 bg-white rounded">
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
    <div v-else class="px-6 py-4 text-gray-500 w-full">
      No questionnaires found.
    </div>
  </BoxSection>
</template>
