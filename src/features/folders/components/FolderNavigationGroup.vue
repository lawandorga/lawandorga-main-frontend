<script setup lang="ts">
import RedBadge from "@/components/RedBadge.vue";
import { VNode } from "vue";

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
    class="relative block w-full transition bg-gray-100 border-t border-gray-200"
    :class="{
      'bg-white!': isSelected,
      'border-t-0': isFirst,
    }"
  >
    <div class="px-4 py-4 sm:px-6">
      <div class="flex flex-wrap items-center justify-between">
        <p class="text-base font-medium text-formcolor">
          {{ name }}
        </p>
        <div v-show="isSelected" class="flex ml-2 space-x-3 shrink-0">
          <component :is="button" v-for="button in buttons" :key="button" />
        </div>
        <RedBadge v-if="badge">
          {{ badge }}
        </RedBadge>
      </div>
    </div>
  </div>
</template>
