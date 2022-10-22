<template>
  <BoxLoader :show="!!actionsEvents">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <CalendarDaysIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonNormal
            size="xs"
            kind="action"
            @click="actionsEvents.addEventModalOpen = true"
          >
            Add Event
          </ButtonNormal>
        </template>
      </BreadcrumbsBar>
      <div v-if="actionsEvents" class="grid grid-cols-1 gap-4">
        <div
          v-for="event in eventsWithFormattedDate"
          :key="event.id"
          class="bg-white rounded-lg shadow p-6 flex flex-row flex-nowrap gap-8"
        >
          <div class="flex-none flex flex-col items-center font-light">
            <h3 class="text-base">
              {{ event.start_time_object.shortMonth }}
            </h3>
            <h2 class="text-4xl">
              {{ event.start_time_object.day }}
            </h2>
            <h3 class="text-base">
              {{ event.start_time_object.year }}
            </h3>
          </div>
          <div class="grow flex flex-col gap-2">
            <div class="flex flex-row gap-6 items-baseline justify-between">
              <h2 class="text-xl font-medium">
                {{ event.name }}
              </h2>
              <div
                v-if="event.is_global"
                class="text-gray-500 flex flex-row items-baseline gap-1"
              >
                <GlobeAltIcon class="w-3 h-3" />
                <h2 class="text-base">
                  {{ event.org.name }}
                </h2>
              </div>
            </div>

            <div class="text-gray-500">
              {{ event.start_time_object.formatted }} –
              {{ event.end_time_object.formatted }}
            </div>
            <p>
              {{ event.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
  <ActionsEvents ref="actionsEvents" />
</template>

<script setup lang="ts">
import ActionsEvents from "@/components/ActionsEvents.vue";
import { ButtonNormal } from "@lawandorga/components";
import { CalendarDaysIcon, GlobeAltIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { Event } from "@/types/event";
import { formatDateToObject } from "@/utils/date";

const actionsEvents = ref<typeof ActionsEvents>();

const eventsWithFormattedDate = computed(() => {
  return actionsEvents?.value?.events?.map((event: Event) => {
    return {
      ...event,
      start_time_object: formatDateToObject(event.start_time),
      end_time_object: formatDateToObject(event.end_time),
    };
  });
});
</script>
