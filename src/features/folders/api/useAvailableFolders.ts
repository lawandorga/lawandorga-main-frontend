import { computed, ref } from "vue";

import useQuery2 from "@/composables/useQuery2";

export interface AvailableFolder {
  id: string;
  name: string;
}

export function useAvailableFolders() {
  const fetched = ref<AvailableFolder[]>();
  const query = useQuery2("/api/folders/query/available_folders/", fetched);

  const folders = computed<AvailableFolder[]>(() => fetched.value ?? []);

  let load: Promise<void> | undefined;

  const loadFolders = () => {
    if (!load) load = query().catch(() => undefined);
    return load;
  };

  return { folders, loadFolders };
}
