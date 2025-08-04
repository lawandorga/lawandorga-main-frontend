<script setup lang="ts">
import { MegaphoneIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { RouteLocationRaw } from "vue-router";

defineProps<{
  text: string;
  button: string;
  to: RouteLocationRaw;
  close: boolean;
}>();

const emit = defineEmits(["close"]);
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
    <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="p-2 rounded-lg shadow-lg bg-formcolor sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center flex-1 w-0">
            <span class="flex p-2 bg-blue-800 rounded-lg">
              <MegaphoneIcon class="w-6 h-6 text-blue-100" aria-hidden="true" />
            </span>
            <p class="ml-3 font-medium text-blue-100 truncate">
              {{ text }}
            </p>
          </div>
          <div
            class="shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto"
          >
            <router-link
              :to="to"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-50"
              @click="emit('close')"
            >
              {{ button }}
            </router-link>
          </div>
          <div class="shrink-0 order-2 sm:order-3 sm:ml-2">
            <button
              v-if="close"
              type="button"
              class="flex p-2 -mr-1 rounded-md hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              @click="emit('close')"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
