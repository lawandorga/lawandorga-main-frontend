<script setup lang="ts">
import { BellAlertIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal, FormSelect, types } from "lorga-ui";

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

const offsetOptions: types.FormOptionInput[] = [...REMINDER_OFFSET_OPTIONS];
const methodOptions: types.FormOptionInput[] = [...REMINDER_METHOD_OPTIONS];
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
          class="flex-1"
          required
          :name="`reminder-offset-${reminder.key}`"
          :model-value="reminder.minutes_before"
          :options="offsetOptions"
          @update:model-value="
            emit('update', reminder.key, { minutes_before: Number($event) })
          "
        />
        <FormSelect
          class="w-32"
          required
          :name="`reminder-method-${reminder.key}`"
          :model-value="reminder.method"
          :options="methodOptions"
          @update:model-value="
            emit('update', reminder.key, { method: $event as ReminderMethod })
          "
        />
        <button
          type="button"
          class="cursor-pointer text-gray-400 hover:text-red-600"
          title="Remove reminder"
          @click="emit('remove', reminder.key)"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </li>
    </ul>

    <ButtonNormal kind="action" :disabled="addingDisabled" @click="emit('add')">
      + Add reminder
    </ButtonNormal>
  </div>
</template>
