<script setup lang="ts">
import BoxSection from "@/components/BoxSection.vue";
import { useFollowUps } from "../api/useFollowUps";
import { formatDate } from "@/utils/date";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

const { followUps } = useFollowUps();
</script>

<template>
  <BoxSection title="Follow Ups" :length="followUps?.length">
    <div v-if="followUps?.length">
      <ul class="p-1 mt-2 space-y-1 bg-white rounded">
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
    <div v-else class="px-6 py-4 text-gray-500 w-full">
      No follow-ups found.
    </div>
  </BoxSection>
</template>
