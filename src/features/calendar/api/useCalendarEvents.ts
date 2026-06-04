import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

export interface CalendarEvent {
  uuid: string;
  creator_id: number;
  creator_name: string;
  title: string;
  description: string;
  event_type: "APPOINTMENT" | "TASK" | "MEETING" | "DEADLINE" | "EXTERNAL";
  start_time: string;
  end_time: string | null;
  location: string;
  recurrence_rule: string;
  recurrence_until: string | null;
  guest_user_ids: number[];
  guest_user_names: string[];
  created: string;
  updated: string;
}

export function useCalendarEvents() {
  const calendarEvents = ref<CalendarEvent[] | undefined>(undefined);
  const query = useGet2("api/calendar/query/events/", calendarEvents);

  return {
    calendarEvents,
    query,
  };
}
