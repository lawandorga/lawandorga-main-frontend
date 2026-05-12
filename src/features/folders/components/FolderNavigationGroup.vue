<script setup lang="ts">
import { VNode } from "vue";

import RedBadge from "@/components/RedBadge.vue";

defineProps<{
  buttons: VNode[];
  name: string;
  isFirst?: boolean;
  isSelected: boolean;
  badge?: string;
}>();
</script>

<template>
  <div
    class="relative block w-full border-t border-gray-200 bg-gray-100 transition"
    :class="{
      'bg-white!': isSelected,
      'border-t-0': isFirst,
    }"
  >
    <div class="px-4 py-4 sm:px-6">
      <div class="flex flex-wrap items-center justify-between">
        <p class="text-formcolor text-base font-medium">
          {{ name }}
        </p>
        <div
          v-show="isSelected"
          class="ml-2 flex shrink-0 space-x-3"
          @click.stop
        >
          <component :is="button" v-for="button in buttons" :key="button" />
        </div>
        <RedBadge v-if="badge">
          {{ badge }}
        </RedBadge>
      </div>
    </div>
  </div>
</template>
