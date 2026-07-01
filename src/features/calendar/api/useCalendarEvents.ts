import { computed, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import { useUserStore } from "@/store/user";

import type { EventType } from "../constants";
import { toFullCalendarEvent } from "./toFullCalendarEvent";

export interface CalendarEvent {
  uuid: string;
  creator_id: number;
  creator_name: string;
  title: string;
  description: string;
  event_type: EventType;
  start_time: string;
  end_time: string | null;
  is_all_day: boolean;
  location: string;
  recurrence_rule: string;
  recurrence_until: string | null;
  grant_targets: string[];
  guest_user_ids: number[];
  guest_user_names: string[];
  created: string;
  updated: string;
}

export function useCalendarEvents() {
  const userStore = useUserStore();
  const calendarEvents = ref<CalendarEvent[] | undefined>(undefined);
  const query = useGet2("api/calendar/query/events/", calendarEvents);

  const fullCalendarEvents = computed(() =>
    (calendarEvents.value ?? []).map((event) =>
      toFullCalendarEvent(event, userStore.user?.id),
    ),
  );

  const isLoading = computed(() => calendarEvents.value === undefined);

  return {
    fullCalendarEvents,
    calendarEvents,
    isLoading,
    query,
  };
}
