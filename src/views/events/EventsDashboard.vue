<template>
  <FormGenerator
    :request="(data: JsonModel) => {return Promise.resolve({data: data})}"
    :fields="[
      {
        name: 'custom',
        type: 'custom',
        label: 'Custom',
      },
    ]"
    @submit="console.log($event)"
  >
    <template #custom="{ data }">
      <FormWysiwyg v-model="data['custom']" />
    </template>
  </FormGenerator>
  <p v-html="textdata"></p>
  <BoxLoader :show="!!eventsWithFormattedDate">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'events-dashboard' }"
        :pages="[]"
      >
        <CalendarDaysIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonNormal
            size="xs"
            kind="action"
            @click="modalCalendarLink.modalOpen = true"
          >
            Get Calendar Link
          </ButtonNormal>
          <ButtonNormal
            size="xs"
            kind="action"
            @click="actionsEvents.addEventModalOpen = true"
          >
            Add Event
          </ButtonNormal>
        </template>
      </BreadcrumbsBar>
      <div class="flex justify-end align-baseline gap-4">
        <ButtonToggle v-model="showGlobal" text="Show global events" />
        <ButtonNormal size="xs" kind="action" @click="loadPastEvents">
          Show earlier
        </ButtonNormal>
      </div>
      <div v-if="eventsWithFormattedDate" class="grid grid-cols-1 gap-4">
        <h2
          v-if="isEventsListEmpty"
          class="text-xl text-lorgablue text-center font-medium"
        >
          No event matches the filter criteria.
        </h2>
        <div
          v-for="day in eventsWithFormattedDate"
          :key="day[0].start_time_object.groupDate"
          class="flex flex-row gap-8 p-6 pt-0 bg-white rounded-lg shadow flex-nowrap"
        >
          <div class="flex flex-col items-center flex-none font-light pt-6">
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
          <div class="flex flex-col w-full gap-6">
            <div v-for="(event, index) in day" :key="index">
              <div
                class="w-full h-1 rounded-b-sm"
                :class="{
                  'bg-lorgablue': !event.is_global && !event.is_past_event,
                  'bg-globalevent': event.is_global && !event.is_past_event,
                  'bg-gray-300': event.is_past_event,
                }"
              />
              <div class="flex flex-col gap-2 grow pt-5">
                <div class="flex flex-row items-baseline gap-6">
                  <h2 class="flex-grow text-xl font-medium">
                    {{ event.name }}
                  </h2>
                  <div
                    v-if="event.is_global"
                    class="flex flex-row items-baseline gap-1 text-gray-500"
                  >
                    <GlobeAltIcon class="w-3 h-3" />
                    <h2 class="text-base">
                      {{ event.org.name }}
                    </h2>
                  </div>
                  <ButtonNormal
                    v-if="userStore.rlc && userStore.rlc.id === event.org.id"
                    size="xs"
                    kind="action"
                    @click="
                      actionsEvents.updateEventModalOpen = true;
                      actionsEvents.eventUpdateTemporary = event;
                    "
                  >
                    Edit
                  </ButtonNormal>
                  <ButtonNormal
                    v-if="userStore.rlc && userStore.rlc.id === event.org.id"
                    size="xs"
                    kind="delete"
                    @click="
                      actionsEvents.deleteEventModalOpen = true;
                      actionsEvents.eventTemporary = event;
                    "
                  >
                    Delete
                  </ButtonNormal>
                </div>

                <div class="text-gray-500">
                  {{ formatDate(event.start_time) }} –
                  {{ formatDate(event.end_time) }}
                </div>
                <p>
                  {{ event.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
  <ActionsEvents ref="actionsEvents" />
  <ModalCalendarLink ref="modalCalendarLink" />
</template>

<script setup lang="ts">
import ActionsEvents from "@/components/ActionsEvents.vue";
import {
  ButtonNormal,
  ButtonToggle,
  FormGenerator,
} from "@lawandorga/components";
import { CalendarDaysIcon, GlobeAltIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { Event } from "@/types/event";
import { formatDate, formatDateToObject, FormattedDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import ModalCalendarLink from "@/components/ModalCalendarLink.vue";
import { useRoute, useRouter } from "vue-router";
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import { JsonModel } from "@lawandorga/components/dist/types/types";

const actionsEvents = ref<typeof ActionsEvents>();
const showGlobal = ref(true);
const modalCalendarLink = ref<typeof ModalCalendarLink>();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const textdata = ref("test");

// eslint-disable-next-line no-unused-vars
function groupBy<T>(xs: T[], getKey: (element: T) => string) {
  if (!xs) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return xs.reduce(function (rv: any, x: T) {
    (rv[getKey(x)] = rv[getKey(x)] || []).push(x);
    return rv;
  }, {});
}

const nextEventIndex = computed(() => {
  return actionsEvents?.value?.events.findIndex(
    (event: Event) => new Date(event.end_time) > new Date(Date.now()),
  );
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
  const current_events = actionsEvents?.value?.events?.slice(
    Math.max(0, nextEventIndex?.value - earlierValue?.value),
  );
  const fileredGlobal = current_events?.filter(
    (event: Event) => showGlobal.value || !event.is_global,
  );
  const events = fileredGlobal?.map((event: Event) => {
    return {
      ...event,
      // Necessary to display the date in the update modal
      is_past_event: event.end_time < new Date().toISOString(),
      start_time_object: formatDateToObject(event.start_time),
      end_time_object: formatDateToObject(event.end_time),
    };
  });
  return groupBy(
    events,
    (
      event: Event & {
        start_time_object: FormattedDate;
        end_time_object: FormattedDate;
      },
    ) => event.start_time_object.groupDate,
  );
});
</script>

<style scoped>
.bg-globalevent {
  background-color: #89a4b7;
}
</style>
