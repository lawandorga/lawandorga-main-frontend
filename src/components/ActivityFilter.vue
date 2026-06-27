<script lang="ts" setup>
import { useId } from "vue";

import type { ActivityFilterOption } from "@/composables/useActivityFilter";

defineProps<{ modelValue: ActivityFilterOption }>();

const labelId = useId();

const emit = defineEmits<{ toggle: [value: ActivityFilterOption] }>();

const filterOptions: {
  label: string;
  value: ActivityFilterOption;
  activeClasses: string;
  inactiveClasses: string;
}[] = [
  {
    label: "All",
    value: "all",
    activeClasses: "bg-gray-800 text-white border-gray-800",
    inactiveClasses:
      "bg-white text-gray-700 border-gray-300 hover:border-gray-500",
  },
  {
    label: "Active (3 mo.)",
    value: "green",
    activeClasses: "bg-green-100 text-green-800 border-green-500",
    inactiveClasses:
      "bg-white text-green-800 border-green-200 hover:border-green-400",
  },
  {
    label: "Active (6 mo.)",
    value: "yellow",
    activeClasses: "bg-yellow-100 text-yellow-800 border-yellow-500",
    inactiveClasses:
      "bg-white text-yellow-800 border-yellow-200 hover:border-yellow-400",
  },
  {
    label: "Logged in (12 mo.)",
    value: "orange",
    activeClasses: "bg-orange-100 text-orange-800 border-orange-500",
    inactiveClasses:
      "bg-white text-orange-800 border-orange-200 hover:border-orange-400",
  },
  {
    label: "Inactive (12+ mo.)",
    value: "red",
    activeClasses: "bg-red-100 text-red-800 border-red-500",
    inactiveClasses:
      "bg-white text-red-800 border-red-200 hover:border-red-400",
  },
];
</script>

<template>
  <div class="flex items-center gap-2" role="group" :aria-labelledby="labelId">
    <span :id="labelId" class="text-sm font-medium text-gray-700">
      Activity:
    </span>
    <div class="flex flex-wrap gap-1">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        type="button"
        :aria-pressed="modelValue === option.value"
        :class="[
          'rounded-full border px-3 py-1 text-sm transition-colors',
          modelValue === option.value
            ? option.activeClasses
            : option.inactiveClasses,
        ]"
        @click="emit('toggle', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
