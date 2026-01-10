import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

interface Rlc {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  level: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  org: Rlc;
}

export function useEvents() {
  const events = ref<Event[] | null>(null);
  const query = useGet2("api/events/", events);

  return {
    events,
    query,
  };
}
