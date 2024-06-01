import { ref } from "vue";
import useClient from "@/api/client";
import useGet from "@/composables/useGet";

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
  const client = useClient();
  const request = client.get("api/events/");

  const events = ref<Event[] | null>(null);
  const query = useGet(request, events);

  return {
    events,
    query,
  };
}
