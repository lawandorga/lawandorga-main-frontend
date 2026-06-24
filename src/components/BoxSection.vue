<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

defineProps<{
  title: string;
  numberOfItems?: number;
}>();

const open = ref(true);
</script>

<template>
  <div class="bg-white shadow-md rounded-xl">
    <div
      class="flex justify-between px-6 py-4"
      :class="{ 'border-b-0': !open }"
    >
      <button
        type="button"
        :aria-expanded="open"
        class="flex items-center justify-center gap-2 text-gray-400 transition-colors hover:text-gray-600 hover:cursor-pointer"
        @click="open = !open"
      >
        <h2 class="text-lg font-medium leading-6 text-gray-700">
          {{ title }}
        </h2>
        <span
          v-if="numberOfItems !== undefined"
          class="rounded-md px-2 py-0.5 font-medium bg-gray-200 text-gray-800"
          >{{ numberOfItems }}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          class="transition-transform duration-200 size-5"
          :class="{ '-rotate-180': !open }"
        />
      </button>
      <div class="flex items-center gap-2">
        <slot name="action" />
      </div>
    </div>
    <div class="border-t-2 border-gray-200" v-show="open">
      <slot />
    </div>
  </div>
</template>
