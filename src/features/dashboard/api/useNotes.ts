import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

export interface DashboardNote {
  id: number;
  title: string;
  note: string;
  order: number;
  is_wide: boolean;
}

export function useNotes() {
  const notes = ref<DashboardNote[] | null>(null);

  const notesQuery = useGet2("api/org/query/notes/", notes);

  return {
    notesQuery,
    notes,
  };
}
