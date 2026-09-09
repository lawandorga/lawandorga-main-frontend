<script setup lang="ts">
import { ButtonNormal, ModalFree } from "lorga-ui";
import { computed, ref } from "vue";

import useCmd from "@/composables/useCmd";

import { EVENT_TYPE_META, type EventType } from "../constants";

interface CalendarLinkResponse {
  uuid: string;
  event_types: EventType[];
  calendar_url: string;
}

const modalOpen = ref(false);
const selectedEventTypes = ref<EventType[]>(
  Object.keys(EVENT_TYPE_META) as EventType[],
);
const calendarUrl = ref<string | null>(null);
const copied = ref(false);

const eventTypes = computed(
  () =>
    Object.entries(EVENT_TYPE_META) as [
      EventType,
      { label: string; color: string },
    ][],
);

const { commandRequest } = useCmd();

async function createLink() {
  const response = (await commandRequest({
    action: "calendar/create_calendar_link",
    event_types: selectedEventTypes.value,
  })) as CalendarLinkResponse;
  calendarUrl.value = response.calendar_url;
  copied.value = false;
}

async function copyLink() {
  if (!calendarUrl.value) return;
  await navigator.clipboard.writeText(calendarUrl.value);
  copied.value = true;
}
</script>

<template>
  <ButtonNormal kind="secondary" @click="modalOpen = true">
    Calendar link
  </ButtonNormal>
  <ModalFree v-model="modalOpen" title="Create calendar link" width="max-w-xl">
    <div class="space-y-5">
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-700">Include event types</p>
        <label
          v-for="[eventType, meta] in eventTypes"
          :key="eventType"
          class="flex items-center gap-3 text-sm text-gray-700"
        >
          <input
            v-model="selectedEventTypes"
            type="checkbox"
            :value="eventType"
          />
          <span
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: meta.color }"
          />
          {{ meta.label }}
        </label>
      </div>
      <ButtonNormal
        v-if="!calendarUrl"
        kind="primary"
        :disabled="selectedEventTypes.length === 0"
        @click="createLink"
      >
        Create link
      </ButtonNormal>
      <template v-else>
        <p class="text-sm break-all text-gray-700">{{ calendarUrl }}</p>
        <ButtonNormal kind="primary" @click="copyLink">
          {{ copied ? "Copied!" : "Copy link" }}
        </ButtonNormal>
      </template>
      <p class="text-sm text-gray-500">
        Keep this link secret. Anyone with it can view the selected events.
      </p>
    </div>
  </ModalFree>
</template>
