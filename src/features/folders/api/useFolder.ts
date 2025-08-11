import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { Ref, computed, ref } from "vue";

export interface Subfolder {
  name: string;
  uuid: string;
}

export interface Folder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
}

export interface Content {
  uuid: string;
  name: string;
  repository:
    | "RECORD"
    | "FILE"
    | "QUESTIONNAIRE"
    | "UPLOAD"
    | "RECORDS_RECORD"
    | "FOLDER"
    | "COLLAB";
}

export interface Access {
  name: string;
  uuid: string;
  source: string;
  actions: string[];
}

export interface FolderDetail {
  folder: Folder;
  access: Access[];
  group_access: Access[];
  content: Content[];
  subfolders: Subfolder[];
}

export function useFolder(folderUuid: Ref<string>) {
  const client = useClient();
  const request = client.get(`/api/folders/query/{}/`, folderUuid);
  const folder = ref<FolderDetail>();
  const query = useGet(request, folder, folderUuid);

  const record = computed<Content | null>(() => {
    if (!folder.value) return null;
    const item = folder.value.content.find((item: Content) => {
      return item.repository === "RECORDS_RECORD";
    });
    if (!item) return null;
    return item;
  });

  const userAccess = computed(() => {
    if (!folder.value) return [];
    return folder.value.access;
  });
  const groupAccess = computed(() => {
    if (!folder.value) return [];
    return folder.value.group_access;
  });

  return {
    query,
    folder,
    record,
    userAccess,
    groupAccess,
  };
}
