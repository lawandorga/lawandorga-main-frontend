<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";

import { useRecords } from "../api/useRecords";

const { records } = useRecords();
</script>

<template>
  <BoxSection title="Active Data Sheets" :length="records?.length">
    <BoxLoader :show="!!records" class="px-4 py-2">
      <div v-if="records?.length">
        <ul class="mt-2 space-y-1 rounded bg-white">
          <li v-for="sheet in records" :key="sheet.uuid" class="block">
            <router-link
              :to="{
                name: 'folders-detail',
                params: { uuid: sheet.folder_uuid },
                query: { selectedType: 'RECORD', selectedId: sheet.uuid },
              }"
              class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              {{ sheet.identifier }}
              ({{ sheet.state }})
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
        No active data sheets.
      </div>
    </BoxLoader>
  </BoxSection>
</template>
