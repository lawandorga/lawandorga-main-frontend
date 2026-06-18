<script setup lang="ts">
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { computed, ref } from "vue";

import { useUserStore } from "@/store/user";
import { formatDate } from "@/utils/date.js";

import DeleteEvent from "../actions/DeleteEvent.vue";
import UpdateEvent from "../actions/UpdateEvent.vue";
import type { CalendarEvent } from "../api/useCalendarEvents";
import {
  EVENT_SOURCE_META,
  EVENT_TYPE_META,
  RECURRENCE_FREQUENCIES,
  TYPE_TINT_ALPHA,
} from "../constants.js";
import CalendarDetailRow from "./CalendarDetailRow.vue";

const props = defineProps<{
  modelValue: boolean;
  event: CalendarEvent | null;
  query: () => void;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const eventTypeMeta = computed(() => EVENT_TYPE_META[props.event!.event_type]);

const eventColor = computed(() => eventTypeMeta.value.color);

const userStore = useUserStore();

const canEdit = computed(
  () => !!props.event && userStore.user?.id === props.event.creator_id,
);

const canDelete = computed(
  () => !!props.event && userStore.user?.id === props.event.creator_id,
);

const updateOpenSignal = ref(0);
const deleteOpenSignal = ref(0);

const sourceMeta = computed(() => {
  // TODO: use actual source
  const meta = EVENT_SOURCE_META.PERSONAL;
  return {
    label: meta.label,
    style: {
      backgroundColor: `${meta.color}22`,
      color: meta.color,
      border: `1px solid ${meta.color}44`,
    },
  };
});

const formattedDate = computed(() => {
  if (!props.event) return "";
  const weekday = new Date(props.event.start_time).toLocaleDateString("en-GB", {
    weekday: "long",
  });
  return `${weekday}, ${formatDate(props.event.start_time, true)}`;
});

const recurrenceLabel = computed(() => {
  if (!props.event) return "";
  const frequency = RECURRENCE_FREQUENCIES.find(
    (option) => option.rule === props.event!.recurrence_rule,
  );
  if (!frequency) return "";
  if (props.event.recurrence_until) {
    return `${frequency.label}, until ${formatDate(props.event.recurrence_until, true)}`;
  }
  return frequency.label;
});

const formattedTime = computed(() => {
  if (!props.event) return "";
  if (props.event.is_all_day) return "All day";
  const start = formatDate(props.event.start_time, false, true);
  if (!props.event.end_time) return start;
  return `${start} - ${formatDate(props.event.end_time, false, true)}`;
});

const closeDetail = () => {
  emit("update:modelValue", false);
};

const openUpdateModal = () => {
  updateOpenSignal.value += 1;
  closeDetail();
};

const openDeleteModal = () => {
  deleteOpenSignal.value += 1;
  closeDetail();
};
</script>

<template>
  <ModalFree
    :model-value="modelValue"
    :title="event?.title ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="event">
      <div class="mb-5 flex gap-2">
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          :style="{
            backgroundColor: `${eventColor}${TYPE_TINT_ALPHA}`,
            color: eventColor,
          }"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :style="{ backgroundColor: eventColor }"
          />
          {{ eventTypeMeta.label }}
        </span>
        <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :style="sourceMeta.style"
        >
          {{ sourceMeta.label }}
        </span>
      </div>

      <dl class="space-y-3 text-sm">
        <CalendarDetailRow label="Date" :icon="CalendarDaysIcon">
          <div>
            <dd class="text-gray-900">{{ formattedDate }}</dd>
            <dd class="text-gray-500">{{ formattedTime }}</dd>
          </div>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.location"
          label="Location"
          :icon="MapPinIcon"
        >
          <dd class="text-gray-900">{{ event.location }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.description"
          label="Description"
          :icon="DocumentTextIcon"
        >
          <dd class="whitespace-pre-wrap text-gray-900">
            {{ event.description }}
          </dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="recurrenceLabel"
          label="Repeats"
          :icon="ArrowPathIcon"
        >
          <dd class="text-gray-900">{{ recurrenceLabel }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow label="Creator" :icon="UserIcon">
          <dd class="text-gray-900">{{ event.creator_name }}</dd>
        </CalendarDetailRow>
      </dl>

      <div
        class="mt-5 flex justify-between gap-3 rounded-sm bg-gray-100 px-5 py-2"
      >
        <ButtonNormal
          v-if="canDelete"
          kind="delete"
          class="mr-auto"
          @click="openDeleteModal"
        >
          Delete
        </ButtonNormal>
        <ButtonNormal v-if="canEdit" kind="secondary" @click="openUpdateModal">
          Edit
        </ButtonNormal>
      </div>
    </template>
  </ModalFree>

  <template v-if="event">
    <UpdateEvent
      :query="query"
      :event-uuid="event.uuid"
      :event-title="event.title"
      :event-type="event.event_type"
      :start-time="event.start_time"
      :end-time="event.end_time"
      :is-all-day="event.is_all_day"
      :location="event.location"
      :description="event.description"
      :recurrence-rule="event.recurrence_rule"
      :recurrence-until="event.recurrence_until"
      :creator-id="event.creator_id"
      :open-signal="updateOpenSignal"
    />
    <DeleteEvent
      :query="query"
      :event-uuid="event.uuid"
      :event-name="event.title"
      :creator-id="event.creator_id"
      :open-signal="deleteOpenSignal"
    />
  </template>
</template>
