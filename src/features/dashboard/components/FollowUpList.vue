<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
import { formatDate } from "@/utils/date";

import { useFollowUps } from "../api/useFollowUps";

const { followUps } = useFollowUps();
</script>

<template>
  <BoxSection title="Follow Ups" :length="followUps?.length">
    <BoxLoader :show="!!followUps" class="px-4 py-2">
      <div v-if="followUps?.length">
        <ul class="mt-2 space-y-1 rounded bg-white">
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
              class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              {{ followUp.title }} - {{ formatDate(followUp.time) }}
              <div
                class="absolute top-0 right-0 bottom-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
              >
                <ChevronRightIcon class="mr-1.5 h-6 w-6 text-gray-300" />
              </div>
            </router-link>
          </li>
        </ul>
      </div>
      <div v-else class="w-full px-6 py-4 text-gray-500">
        No follow-ups found.
      </div>
    </BoxLoader>
  </BoxSection>
</template>
