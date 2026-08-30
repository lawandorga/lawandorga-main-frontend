<script setup lang="ts">
import { BellAlertIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";
import { FormSelect } from "lorga-ui";

import type { ReminderMethod, ReminderSettings } from "../constants";
import { REMINDER_METHOD_OPTIONS, REMINDER_OFFSET_OPTIONS } from "../constants";

export interface ReminderRow extends ReminderSettings {
  key: string | number;
}

defineProps<{
  reminders: ReminderRow[];
  addingDisabled?: boolean;
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
        class="flex items-end gap-2"
      >
        <FormSelect
          :id="`reminder-offset-${reminder.key}`"
          class="w-full"
          :model-value="reminder.minutes_before"
          @change="
            emit('update', reminder.key, {
              minutes_before: Number(selectValue($event)),
            })
          "
          required
          :options="
            REMINDER_OFFSET_OPTIONS.map((option) => ({
              value: option.minutes,
              name: option.label,
            }))
          "
        >
        </FormSelect>
        <FormSelect
          :id="`reminder-method-${reminder.key}`"
          :model-value="reminder.method"
          class="w-32"
          @change="
            emit('update', reminder.key, {
              method: selectValue($event) as ReminderMethod,
            })
          "
          :options="
            REMINDER_METHOD_OPTIONS.map((o) => ({
              name: o.label,
              value: o.value,
            }))
          "
        >
        </FormSelect>
        <div class="flex h-10 w-10 items-center justify-center">
          <button
            type="button"
            class="text-gray-400 hover:text-red-600"
            title="Remove reminder"
            @click="emit('remove', reminder.key)"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </li>
    </ul>

    <ButtonNormal kind="action" :disabled="addingDisabled" @click="emit('add')">
      + Add reminder
    </ButtonNormal>
  </div>
</template>
