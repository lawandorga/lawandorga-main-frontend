import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, ref } from "vue";

export interface TreeFolder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
  has_access: boolean;
  actions: string[];
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
  uuid: string | null;
  source: string;
  actions: string[];
}

export interface FolderItem {
  folder: TreeFolder;
  children: FolderItem[];
  access: Access[];
  group_access: Access[];
  content: Content[];
}

export interface FolderPerson {
  name: string;
  uuid: string;
}

export interface FolderGroup {
  name: string;
  uuid: string;
}

export interface FolderPage {
  tree: FolderItem[];
  available_persons: FolderPerson[];
  available_groups: FolderGroup[];
}

export function useFolderPage() {
  const client = useClient();
  const request = client.get<FolderPage>("api/folders/query/");
  const page = ref<FolderPage>();
  const query = useGet(request, page);

  const availableGroups = computed(() => {
    if (!page.value) return [];
    return page.value.available_groups;
  });

  const availablePersons = computed(() => {
    if (!page.value) return [];
    return page.value.available_persons;
  });

  const folderItems = computed<FolderItem[]>(() => {
    if (!page.value) return [];
    return page.value.tree;
  });

  const pushIntoList = (l: Folder[], item: FolderItem) => {
    l.push(item.folder);
    for (const i of item.children) pushIntoList(l, i);
  };

  const folderList = computed<Folder[]>(() => {
    if (folderItems.value === null) return [];
    const fl: Folder[] = [];
    for (const i of folderItems.value) {
      pushIntoList(fl, i);
    }
    return fl;
  });

  return {
    query,
    page,
    availableGroups,
    availablePersons,
    folderItems,
    folderList,
  };
}
