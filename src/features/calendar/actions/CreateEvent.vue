<script setup lang="ts">
import { ModalCreate, types } from "lorga-ui";
import { computed, ref, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";
import ReminderListEditor, {
  type ReminderRow,
} from "../components/ReminderListEditor.vue";
import useShareTargetOptions from "../composables/useShareTargetOptions";
import { DEFAULT_REMINDER, type ReminderSettings } from "../constants";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
const { shareTargetOptions, loadShareTargetOptions } = useShareTargetOptions();

const reminderDrafts = ref<ReminderSettings[]>([]);

const reminderRows = computed<ReminderRow[]>(() =>
  reminderDrafts.value.map((draft, index) => ({ key: index, ...draft })),
);

const addReminderDraft = () => {
  reminderDrafts.value = [...reminderDrafts.value, { ...DEFAULT_REMINDER }];
};

const updateReminderDraft = (
  key: string | number,
  patch: Partial<ReminderSettings>,
) => {
  reminderDrafts.value = reminderDrafts.value.map((draft, index) =>
    index === key ? { ...draft, ...patch } : draft,
  );
};

const removeReminderDraft = (key: string | number) => {
  reminderDrafts.value = reminderDrafts.value.filter(
    (_, index) => index !== key,
  );
};

const DEFAULT_DURATION_MS = 30 * 60 * 1000;

interface EventTimePrefill {
  start: Date;
  end?: Date;
  allDay?: boolean;
}

const buildInitialData = (prefill?: EventTimePrefill) => {
  const start = prefill?.start ?? new Date();
  const defaultEnd = new Date(start.getTime() + DEFAULT_DURATION_MS);
  const end = prefill?.end ?? (prefill?.allDay ? null : defaultEnd);

  reminderDrafts.value = [];

  return {
    action: "calendar/create_event",
    event_type: "APPOINTMENT",
    is_all_day: prefill?.allDay ?? false,
    start_time: toLocalDateTimeInput(start.toISOString()),
    end_time: end ? toLocalDateTimeInput(end.toISOString()) : "",
    recurrence_rule: "",
    recurrence_until: "",
    grant_targets: [],
  };
};

const fields = computed<types.FormField[]>(() => [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    name: "event_type",
    type: "slot",
  },
  {
    name: "when",
    type: "slot",
  },
  {
    label: "Visible To",
    name: "grant_targets",
    type: "multiple",
    required: false,
    options: shareTargetOptions.value,
    helptext: "Search and select users, groups, or the whole org.",
  },
  {
    label: "Location",
    name: "location",
    type: "text",
    required: false,
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    required: false,
  },
  {
    name: "reminder",
    type: "slot",
  },
]);

watch(commandModalOpen, (isOpen) => {
  if (!isOpen) return;
  loadShareTargetOptions();
});

const request = (data: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = { ...data };
  if (normalized.end_time === "") normalized.end_time = null;
  if (normalized.recurrence_until === "") normalized.recurrence_until = null;

  const isRecurring = normalized.recurrence_rule !== "";
  if (!isRecurring && reminderDrafts.value.length > 0) {
    normalized.reminders = reminderDrafts.value.map(
      (draft) => `${draft.method}:${draft.minutes_before}`,
    );
  }

  return commandRequest(normalized);
};

// lorga-ui re-clones :data into the form only when the object reference changes,
// so open() assigns a fresh object here to reset the form on each opening
const initialData = ref<Record<string, unknown>>(buildInitialData());

defineExpose({
  open: (prefill?: EventTimePrefill) => {
    initialData.value = buildInitialData(prefill);
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create Event"
    :fields="fields"
    :request="request"
    :data="initialData"
    submit="Create"
  >
    <template #event_type="{ data }">
      <CalendarTypePicker v-model="data.event_type" />
    </template>
    <template #when="{ data }">
      <CalendarWhenFields
        v-model:is-all-day="data.is_all_day"
        v-model:start="data.start_time"
        v-model:end="data.end_time"
        v-model:recurrence-rule="data.recurrence_rule"
        v-model:recurrence-until="data.recurrence_until"
        :event-type="data.event_type"
      />
    </template>
    <template #reminder="{ data }">
      <ReminderListEditor
        v-if="data.recurrence_rule === ''"
        :reminders="reminderRows"
        @add="addReminderDraft"
        @update="updateReminderDraft"
        @remove="removeReminderDraft"
      />
      <p v-else class="text-sm text-gray-500">
        Reminders for repeating events are coming soon.
      </p>
    </template>
  </ModalCreate>
</template>
