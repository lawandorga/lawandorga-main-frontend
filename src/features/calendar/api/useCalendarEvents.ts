import { computed, ref } from "vue";

import useGet2 from "@/composables/useGet2";

import { EVENT_TYPE_META } from "../constants";

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

const TINT_ALPHA = "20"; // 12.5% opacity

const getEventTypeColor = (eventType: CalendarEvent["event_type"]): string =>
  EVENT_TYPE_META[eventType].color;

export function useCalendarEvents() {
  const calendarEvents = ref<CalendarEvent[] | undefined>(undefined);
  const query = useGet2("api/calendar/query/events/", calendarEvents);

  const fullCalendarEvents = computed(() => {
    return (calendarEvents.value ?? []).map((event) => {
      const color = getEventTypeColor(event.event_type);
      return {
        id: event.uuid,
        title: event.title,
        start: event.start_time,
        end: event.end_time ?? undefined,
        backgroundColor: `${color}${TINT_ALPHA}`,
        borderColor: color, // TODO: calendar source color in the future
        textColor: color,
        extendedProps: { calendarEvent: event },
      };
    });
  });

  const isLoading = computed(() => calendarEvents.value === undefined);

  return {
    fullCalendarEvents,
    calendarEvents,
    isLoading,
    query,
  };
}
