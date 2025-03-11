import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref } from "vue";

export interface DashboardNote {
  id: number;
  title: string;
  note: string;
  note_with_links: string;
}

export function useNotes() {
  const client = useClient();
  const notes = ref<DashboardNote[] | null>(null);

  const notesQuery = useGet(client.get("api/org/query/notes/"), notes);

  return {
    notesQuery,
    notes,
  };
}
