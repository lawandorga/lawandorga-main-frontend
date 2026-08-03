import { computed, ref } from "vue";

import useGet2 from "@/composables/useGet2";

export interface DashboardNote {
  id: number;
  title: string;
  note: string;
  order: number;
  is_wide: boolean;
  is_new: boolean;
  created: string;
  updated: string | null;
}

const UPDATED_BUFFER_MS = 2000;

function resetUpdatedDate(note: DashboardNote): DashboardNote {
  const createdTime = new Date(note.created).getTime();
  const updatedTime = note.updated ? new Date(note.updated).getTime() : null;

  if (updatedTime !== null && updatedTime - createdTime <= UPDATED_BUFFER_MS) {
    return { ...note, updated: null };
  }
  return note;
}

export function useNotes() {
  const rawNotes = ref<DashboardNote[] | null>(null);

  const notesQuery = useGet2("api/org/query/notes/", rawNotes);

  const notes = computed(() => rawNotes.value?.map(resetUpdatedDate) ?? null);

  return {
    notesQuery,
    notes,
  };
}
