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
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="bg-formcolor rounded-lg p-2 shadow-lg sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-blue-800 p-2">
              <MegaphoneIcon class="h-6 w-6 text-blue-100" aria-hidden="true" />
            </span>
            <p class="ml-3 truncate font-medium text-blue-100">
              {{ text }}
            </p>
          </div>
          <div
            class="order-3 mt-2 w-full shrink-0 sm:order-2 sm:mt-0 sm:w-auto"
          >
            <router-link
              :to="to"
              class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-indigo-50"
              @click="emit('close')"
            >
              {{ button }}
            </router-link>
          </div>
          <div class="order-2 shrink-0 sm:order-3 sm:ml-2">
            <button
              v-if="close"
              type="button"
              class="-mr-1 flex cursor-pointer rounded-md p-2 hover:bg-blue-500/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              @click="emit('close')"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
