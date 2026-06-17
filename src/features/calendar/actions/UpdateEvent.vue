<script setup lang="ts">
import { ModalUpdate, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";
import { toLocalDateTimeInput } from "@/utils/date";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  eventTitle: string;
  eventType: "APPOINTMENT" | "TASK" | "MEETING" | "DEADLINE" | "EXTERNAL";
  startTime: string;
  endTime: string | null;
  location: string;
  description: string;
  recurrenceRule: string;
  recurrenceUntil: string | null;
  creatorId: number;
  openSignal?: number;
}>();
const {
  query,
  eventUuid,
  eventTitle,
  eventType,
  startTime,
  endTime,
  location,
  description,
  creatorId,
  openSignal,
} = toRefs(props);

const userStore = useUserStore();

const canEdit = computed(() => userStore.user?.id === creatorId.value);

const fields: types.FormField[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Type",
    name: "event_type",
    type: "select",
    required: true,
    options: [
      { name: "Appointment", value: "APPOINTMENT" },
      { name: "Task", value: "TASK" },
      { name: "Meeting", value: "MEETING" },
      { name: "Deadline", value: "DEADLINE" },
      { name: "External", value: "EXTERNAL" },
    ],
  },
  {
    label: "Start time",
    name: "start_time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End time",
    name: "end_time",
    type: "datetime-local",
    required: false,
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
];

const { commandRequest, commandModalOpen } = useCmd(query.value);

watch(openSignal, (next, prev) => {
  if (next !== undefined && next !== prev && canEdit.value) {
    commandModalOpen.value = true;
  }
});
</script>

<template>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Edit Event"
    :request="commandRequest"
    :data="{
      event_uuid: eventUuid,
      title: eventTitle,
      event_type: eventType,
      start_time: toLocalDateTimeInput(startTime),
      end_time: endTime ? toLocalDateTimeInput(endTime) : '',
      location,
      description,
      action: 'calendar/update_event',
    }"
    submit="Update"
  />
</template>
