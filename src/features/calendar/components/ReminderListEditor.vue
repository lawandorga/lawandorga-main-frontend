<script setup lang="ts">
import { BellAlertIcon, TrashIcon } from "@heroicons/vue/24/outline";

import type { ReminderMethod, ReminderSettings } from "../constants";
import { REMINDER_METHOD_OPTIONS, REMINDER_OFFSET_OPTIONS } from "../constants";

export interface ReminderRow extends ReminderSettings {
  key: string | number;
}

defineProps<{
  reminders: ReminderRow[];
}>();

const emit = defineEmits<{
  add: [];
  update: [key: string | number, patch: Partial<ReminderSettings>];
  remove: [key: string | number];
}>();

const selectValue = (event: Event): string =>
  (event.target as HTMLSelectElement).value;
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-sm font-medium text-gray-900">
      <BellAlertIcon class="h-5 w-5 text-gray-400" />
      <span>Your reminders</span>
    </div>

    <ul v-if="reminders.length" class="space-y-1.5">
      <li
        v-for="reminder in reminders"
        :key="reminder.key"
        class="flex items-center gap-2"
      >
        <select
          :value="reminder.minutes_before"
          class="focus:border-formcolor flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none"
          @change="
            emit('update', reminder.key, {
              minutes_before: Number(selectValue($event)),
            })
          "
        >
          <option
            v-for="option in REMINDER_OFFSET_OPTIONS"
            :key="option.minutes"
            :value="option.minutes"
          >
            {{ option.label }}
          </option>
        </select>
        <select
          :value="reminder.method"
          class="focus:border-formcolor rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none"
          @change="
            emit('update', reminder.key, {
              method: selectValue($event) as ReminderMethod,
            })
          "
        >
          <option
            v-for="option in REMINDER_METHOD_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <button
          type="button"
          class="text-gray-400 hover:text-red-600"
          title="Remove reminder"
          @click="emit('remove', reminder.key)"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="text-sm font-medium text-blue-600 hover:text-blue-800"
      @click="emit('add')"
    >
      + Add reminder
    </button>
  </div>
</template>
