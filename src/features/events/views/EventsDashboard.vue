<template>
  <BoxLoader :show="!!eventsWithFormattedDate">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'events-dashboard' }"
        :pages="[]"
      >
        <CalendarDaysIcon class="w-6 h-6" />
        <template #buttons>
          <EventsGetCalendarLink />
          <EventsCreateEvent :query="query" />
        </template>
      </BreadcrumbsBar>
      <div class="flex justify-end gap-4 align-baseline">
        <ButtonToggle v-model="showGlobal" text="Show global events" />
        <ButtonNormal size="xs" kind="secondary" @click="loadPastEvents">
          Show earlier
        </ButtonNormal>
      </div>
      <div v-if="eventsWithFormattedDate" class="grid grid-cols-1 gap-4">
        <h2
          v-if="isEventsListEmpty"
          class="text-xl font-medium text-center text-formcolor"
        >
          No event matches the filter criteria.
        </h2>
        <div
          v-for="day in eventsWithFormattedDate"
          :key="day[0].start_time_object.groupDate"
          class="relative flex flex-row gap-8 p-6 pt-0 bg-white rounded-lg shadow flex-nowrap"
        >
          <div class="flex flex-col items-center flex-none pt-6 font-light">
            <h3 class="text-base">
              {{ day[0].start_time_object.shortMonth }}
            </h3>
            <h2 class="text-4xl">
              {{ day[0].start_time_object.day }}
            </h2>
            <h3 class="text-base">
              {{ day[0].start_time_object.year }}
            </h3>
          </div>
          <div class="flex flex-col w-full gap-6 overflow-hidden">
            <div v-for="(event, index) in day" :key="index">
              <div
                class="w-full h-1"
                :class="{
                  'bg-formcolor': event.level === 'ORG' && !event.is_past_event,
                  'bg-blue-500': event.level === 'META' && !event.is_past_event,
                  'bg-blue-300':
                    event.level === 'GLOBAL' && !event.is_past_event,
                  'bg-gray-300': event.is_past_event,
                }"
              />
              <div class="flex flex-col gap-2 pt-5 grow">
                <div class="flex flex-row items-center gap-6">
                  <h2 class="flex-grow text-xl font-medium">
                    {{ event.name }}
                  </h2>
                  <EventsUpdateEvent
                    v-if="event.org.id === userStore.rlc?.id"
                    :event="event"
                    :query="query"
                  />
                  <EventsDeleteEvent
                    v-if="event.org.id === userStore.rlc?.id"
                    :event-id="event.id"
                    :event-org-id="event.org.id"
                    :query="query"
                    :event-name="event.name"
                  />
                </div>
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                    <CalendarIcon class="w-5 h-5 text-gray-600" />
                    <div class="text-gray-600">
                      {{ formatDate(event.start_time) }} –
                      {{ formatDate(event.end_time) }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <EyeIcon class="w-5 h-5 text-gray-500" />
                    <div class="text-gray-600">
                      {{ event.level }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <HomeIcon class="w-5 h-5 text-gray-500" />
                    <div class="text-gray-600">
                      {{ event.org.name }}
                    </div>
                  </div>
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  class="prose prose-p:mt-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-p:mb-0"
                  v-html="event.description"
                ></div>
                <!-- eslint-enable vue/no-v-html -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>

<script setup lang="ts">
import { ButtonNormal, ButtonToggle } from "lorga-ui";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { EyeIcon, CalendarIcon, HomeIcon } from "@heroicons/vue/20/solid";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { formatDate, formatDateToObject, FormattedDate } from "@/utils/date";
import { useRoute, useRouter } from "vue-router";
import EventsCreateEvent from "@/features/events/actions/EventsCreateEvent.vue";
import EventsUpdateEvent from "@/features/events/actions/EventsUpdateEvent.vue";
import EventsDeleteEvent from "@/features/events/actions/EventsDeleteEvent.vue";
import EventsGetCalendarLink from "@/features/events/actions/EventsGetCalendarLink.vue";
import { useUserStore } from "@/store/user";
import { useEvents, Event } from "../api/useEvents";

const showGlobal = ref(true);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// eslint-disable-next-line no-unused-vars
function groupBy<T>(items: T[], getKey: (element: T) => string) {
  if (!items) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsGroupedByKey = items.reduce(function (results: any, item: T) {
    const currentKey = getKey(item);
    if (!results[currentKey]) {
      results[currentKey] = [];
    }
    results[currentKey].push(item);
    return results;
  }, {});
  return itemsGroupedByKey;
}

const { events, query } = useEvents();

const nextEventIndex = computed<number>(() => {
  if (!events.value) return 0;

  const rawNextEvent = events.value.findIndex(
    (event: Event) => new Date(event.end_time) > new Date(Date.now()),
  );
  return rawNextEvent === -1 ? events.value.length : rawNextEvent;
});

function loadPastEvents() {
  const newEarlier = earlierValue?.value + 10;
  router.push({ path: "/events/", query: { earlier: newEarlier } });
}

const earlierValue = computed(() => Number(route.query?.earlier ?? 0));

const isEventsListEmpty = computed(() => {
  return Object.keys(eventsWithFormattedDate?.value || {}).length === 0;
});

const eventsWithFormattedDate = computed(() => {
  if (!events.value) return [];

  const current_events = events.value?.slice(
    Math.max(0, nextEventIndex?.value - earlierValue?.value),
  );
  const fileredGlobal = current_events?.filter(
    (event: Event) => showGlobal.value || event.level === "ORG",
  );
  const events2 = fileredGlobal?.map((event: Event) => {
    return {
      ...event,
      // Necessary to display the date in the update modal
      is_past_event: event.end_time < new Date().toISOString(),
      start_time_object: formatDateToObject(event.start_time),
      end_time_object: formatDateToObject(event.end_time),
    };
  });
  return groupBy(
    events2,
    (
      event: Event & {
        start_time_object: FormattedDate;
        end_time_object: FormattedDate;
      },
    ) => event.start_time_object.groupDate,
  );
});
</script>
