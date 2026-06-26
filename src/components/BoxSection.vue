<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { ref } from "vue";

defineProps<{
  title: string;
  numberOfItems?: number;
}>();

const open = ref(true);
</script>

<template>
  <div class="rounded-xl bg-white shadow-md">
    <div
      class="flex justify-between px-6 py-4"
      :class="{ 'border-b-0': !open }"
    >
      <button
        type="button"
        :aria-expanded="open"
        class="flex items-center gap-2 text-gray-400 transition-colors hover:cursor-pointer hover:text-gray-600"
        @click="open = !open"
      >
        <h2 class="text-lg leading-6 font-medium text-gray-700">
          {{ title }}
        </h2>
        <span
          v-if="numberOfItems !== undefined"
          class="rounded-md bg-gray-200 px-2 py-0.5 font-medium text-gray-800"
          >{{ numberOfItems }}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          class="size-5 transition-transform duration-200"
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
