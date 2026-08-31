<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { RouteLocationRaw } from "vue-router";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";

export interface BoxLink {
  key: string | number;
  label: string;
  to: RouteLocationRaw;
}

defineProps<{
  title: string;
  links?: BoxLink[];
  emptyText: string;
}>();
</script>

<template>
  <BoxSection :title="title" :number-of-items="links?.length">
    <BoxLoader :show="!!links" class="p-2">
      <ul v-if="links?.length" class="space-y-1">
        <li v-for="link in links" :key="link.key" class="block">
          <router-link
            :to="link.to"
            class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            {{ link.label }}
            <div
              class="absolute top-0 right-0 bottom-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
            >
              <ChevronRightIcon
                aria-hidden="true"
                class="mr-1.5 h-6 w-6 text-gray-300"
              />
            </div>
          </router-link>
        </li>
      </ul>
      <div v-else class="px-4 py-2 text-gray-500">{{ emptyText }}</div>
    </BoxLoader>
  </BoxSection>
</template>
