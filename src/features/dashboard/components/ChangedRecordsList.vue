<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";

import { useChangedRecords } from "../api/useChangedRecords";
const { changedRecords } = useChangedRecords();
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import { formatDate } from "@/utils/date";
</script>

<template>
  <BoxSection
    title="Records updated in the last 10 days"
    :length="changedRecords?.length"
  >
    <BoxLoader :show="!!changedRecords" class="px-4 py-2">
      <div v-if="changedRecords?.length">
        <ul class="mt-2 space-y-1 rounded bg-white">
          <li v-for="record in changedRecords" :key="record.uuid" class="block">
            <router-link
              :to="{
                name: 'folders-detail',
                params: { uuid: record.folder_uuid },
              }"
              class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              {{ record.identifier }}
              ({{ formatDate(record.updated) }})
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
        No changed records found.
      </div>
    </BoxLoader>
  </BoxSection>
</template>
