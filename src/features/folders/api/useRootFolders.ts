import { computed, ref } from "vue";
import useQuery2 from "@/composables/useQuery2";

interface RootFolder {
  uuid: string;
  name: string;
}

export function useRootFolders() {
  const rootFolders = ref<RootFolder[]>([]);

  const query = useQuery2("/api/folders/query/root_folders/", rootFolders);

  const recordsFolderUuid = computed<string | undefined>(() => {
    const folder = rootFolders.value.find(
      (folder) => folder.name === "Records",
    );
    return folder ? folder.uuid : undefined;
  });

  return {
    query,
    rootFolders,
    recordsFolderUuid,
  };
}
