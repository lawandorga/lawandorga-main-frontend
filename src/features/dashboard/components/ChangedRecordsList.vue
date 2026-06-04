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
    <div class="px-4 py-2">
      <BoxLoader :show="!!changedRecords"></BoxLoader>
    </div>
    <div v-if="changedRecords?.length">
      <ul class="p-1 mt-2 space-y-1 bg-white rounded">
        <li v-for="record in changedRecords" :key="record.uuid" class="block">
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
    <div v-else class="w-full px-6 py-4 text-gray-500">
      No changed records found.
    </div>
  </BoxSection>
</template>
