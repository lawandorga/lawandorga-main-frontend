<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
import { useRecords } from "../api/useRecords";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

const { records } = useRecords();
</script>

<template>
  <BoxSection title="Active Data Sheets" :length="records?.length">
      <BoxLoader :show="!!records" class="px-4 py-2">
        <div v-if="records?.length">
          <ul class="mt-2 space-y-1 bg-white rounded">
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
        <div v-else class="w-full px-6 py-4 text-gray-500">
          No active data sheets.
        </div>
      </BoxLoader>
  </BoxSection>
</template>
