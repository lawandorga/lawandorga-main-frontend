<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

defineProps<{
  title: string;
  length?: number;
}>();

const open = ref(true);
</script>

<template>
  <div class="bg-white rounded-xl shadow-md">
    <div
      class="flex justify-between border-b-2 px-6 py-4 border-gray-200"
      :class="{ 'border-b-0': !open }"
    >
      <div class="flex gap-2 justify-center items-center">
        <h2 class="items-baseline text-lg font-medium leading-6 text-gray-700">
          {{ title }}
        </h2>
        <span
          class="rounded-md px-2 py-0.5 font-medium bg-gray-200 text-gray-800"
          >{{ length }}
        </span>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="open = !open"
        >
          <ChevronDownIcon
            class="size-5 transition-transform duration-200"
            :class="{ '-rotate-180': !open }"
          />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <slot name="action" />
      </div>
    </div>
    <div v-show="open">
      <slot />
    </div>
  </div>
</template>
