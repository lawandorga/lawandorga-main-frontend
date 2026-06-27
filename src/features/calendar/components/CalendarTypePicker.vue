<script setup lang="ts">
import { computed } from "vue";

import { EVENT_TYPE_META, type EventType, TYPE_TINT_ALPHA } from "../constants";

const props = defineProps<{
  modelValue: EventType | undefined;
  label?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: EventType];
}>();

const typeChoices = computed(() => {
  const entries = Object.entries(EVENT_TYPE_META) as [
    EventType,
    { label: string; color: string },
  ][];
  return entries.map(([value, meta]) => ({
    value,
    label: meta.label,
    color: meta.color,
    isSelected: props.modelValue === value,
  }));
});

const selectType = (value: EventType) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div role="group" :aria-label="label ?? 'Type'">
    <span class="mb-1 block text-sm font-medium text-gray-700">
      {{ label ?? "Type" }}
    </span>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="choice in typeChoices"
        :key="choice.value"
        type="button"
        :aria-pressed="choice.isSelected"
        class="inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
        :style="{
          borderColor: choice.color,
          color: choice.color,
          backgroundColor: choice.isSelected
            ? `${choice.color}${TYPE_TINT_ALPHA}`
            : '#fff',
        }"
        @click="selectType(choice.value)"
      >
        {{ choice.label }}
      </button>
    </div>
  </div>
</template>
