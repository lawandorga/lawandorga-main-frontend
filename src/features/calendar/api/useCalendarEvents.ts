import { computed, ref } from "vue";

import useClient from "@/api/client";
import useGet2 from "@/composables/useGet2";

import type { EventType, ReminderMethod } from "../constants";

export interface CalendarEventReminder {
  uuid: string;
  minutes_before: number;
  method: ReminderMethod;
}

export interface OccurrenceOverride {
  uuid: string;
  original_start: string;
  cancelled: boolean;
  start_time: string | null;
  end_time: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
}

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
  view_grant_targets: string[];
  edit_grant_targets: string[];
  guest_user_ids: number[];
  guest_user_names: string[];
  own_reminders: CalendarEventReminder[];
  overrides: OccurrenceOverride[];
  created: string;
  updated: string;
}

export interface CalendarOccurrence {
  event_uuid: string;
  original_start: string;
  title: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  event_type: EventType;
}

export function useCalendarEvents() {
  const calendarEvents = ref<CalendarEvent[] | undefined>(undefined);
  const query = useGet2("api/calendar/query/events/", calendarEvents);

  const isLoading = computed(() => calendarEvents.value === undefined);

  return {
    calendarEvents,
    isLoading,
    query,
  };
}

export function useCalendarOccurrences() {
  const client = useClient();

  // the endpoint expands the series for the range, applies overrides, and omits
  // cancelled occurrences
  const fetchOccurrences = (fromIso: string, toIso: string) =>
    client.get<CalendarOccurrence[]>(
      `api/calendar/query/occurrences/?from_dt=${encodeURIComponent(
        fromIso,
      )}&to_dt=${encodeURIComponent(toIso)}`,
    )();

  return { fetchOccurrences };
}
