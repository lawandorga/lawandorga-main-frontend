<template>
  <div
    v-if="!!foldersActions && !!contentActions"
    class="bg-white divide-y-2 rounded shadow"
  >
    <div class="px-3 py-2">
      <FoldersCreateRootFolder :query="query" />
    </div>
    <div class="flex flex-col divide-y xl:divide-y-0 xl:flex-row xl:divide-x">
      <div class="w-full px-6 py-4">
        <FoldersTree
          :folders="folderItems"
          @add-child-clicked="
            parent = $event;
            foldersActions!.createModalOpen = true;
          "
          @add-content-clicked="
            parent = $event;
            contentActions!.addContentModalOpen = true;
          "
          @folder-clicked="selected = $event"
          @show-meta-clicked="selected = $event"
        />
      </div>
      <div v-if="selectedItem" class="w-full px-6 py-4 xl:max-w-xl bg-gray-50">
        <div class="sticky top-0">
          <div class="flex justify-between">
            <h2 class="text-lg font-medium text-gray-800 truncate">
              {{ selectedItem.folder.name }}
            </h2>
            <ButtonClose @click="selected = null" />
          </div>

          <div class="flex mt-2 space-x-3">
            <FoldersChangeName
              :folder-uuid="selectedItem.folder.uuid"
              :folder-name="selectedItem.folder.name"
              :query="query"
            />
            <FoldersToggleInheritance
              :query="query"
              :folder-uuid="selectedItem.folder.uuid"
              :folder-name="selectedItem.folder.name"
              :folder-inheritance-stopped="selectedItem.folder.stop_inherit"
            />
            <FoldersMoveFolder
              :query="query"
              :folder-uuid="selectedItem.folder.uuid"
              :available-folders="folderList"
            />
            <FoldersDeleteFolder
              :folder-name="selectedItem.folder.name"
              :folder-uuid="selectedItem.folder.uuid"
              :query="query"
            />
          </div>
          <p
            v-if="selectedItem.folder.stop_inherit"
            class="mt-4 text-sm text-green-700"
          >
            Info: This folder has the access cut from above. That means that
            persons who have access to its parent will
            <b>not</b>
            have access to this folder.
          </p>
          <h3 class="mt-4 mb-2 font-medium text-gray-800">
            Persons with access:
          </h3>
          <TableFolderPersonsWithAccess
            :query="query"
            :available-persons="availablePersons"
            :item="selectedItem"
          />
          <h3 class="mt-4 mb-2 font-medium text-gray-800">
            Groups with access:
          </h3>
          <TableFolderGroupsWithAccess
            :query="query"
            :available-groups="availableGroups"
            :item="selectedItem"
          />
        </div>
      </div>
    </div>
  </div>
  <FoldersCreateFolder
    ref="foldersActions"
    class="hidden"
    :query="query"
    :parent="parent"
  />
  <FoldersAddContent
    ref="contentActions"
    class="hidden"
    :query="query"
    :folder-uuid="parent ? parent : undefined"
  />
</template>

<script setup lang="ts">
import FoldersCreateFolder from "@/features/folders/actions/FoldersCreateFolder.vue";
import { computed, ref, toRefs } from "vue";
import FoldersTree from "@/features/folders/components/FoldersTree.vue";
import ButtonClose from "@/components/ButtonClose.vue";
import FoldersCreateRootFolder from "@/features/folders/actions/FoldersCreateRootFolder.vue";
import FoldersChangeName from "@/features/folders/actions/FoldersChangeName.vue";
import FoldersToggleInheritance from "@/features/folders/actions/FoldersToggleInheritance.vue";
import FoldersDeleteFolder from "@/features/folders/actions/FoldersDeleteFolder.vue";
import FoldersMoveFolder from "@/features/folders/actions/FoldersMoveFolder.vue";
import TableFolderPersonsWithAccess from "@/features/folders/components/TableFolderPersonsWithAccess.vue";
import FoldersAddContent from "@/features/folders/actions/FoldersAddContent.vue";
import TableFolderGroupsWithAccess from "./TableFolderGroupsWithAccess.vue";
import {
  Folder,
  FolderGroup,
  FolderItem,
  FolderPerson,
} from "../api/useFolderPage";

const props = defineProps<{
  availablePersons: FolderPerson[];
  availableGroups: FolderGroup[];
  folderItems: FolderItem[];
  query: () => void;
}>();
const { availablePersons, folderItems } = toRefs(props);

// actions
const contentActions = ref<typeof FoldersCreateFolder>();
const foldersActions = ref<typeof FoldersCreateFolder>();

// folders as list
const pushIntoList = (l: Folder[], item: FolderItem) => {
  l.push(item.folder);
  for (let i of item.children) pushIntoList(l, i);
};

const folderList = computed<Folder[]>(() => {
  if (folderItems.value === null) return [];
  const fl: Folder[] = [];
  for (let i of folderItems.value) {
    pushIntoList(fl, i);
  }
  return fl;
});

// parent
const parent = ref<string | null>(null);

// selected folder
const selected = ref<string | null>(null);

const findFolder = (
  id: string,
  folderItems: FolderItem[],
): FolderItem | null => {
  for (let i of folderItems) {
    if (i.folder.uuid === selected.value) return i;
    const innerFound = findFolder(id, i.children);
    if (innerFound) return innerFound;
  }
  return null;
};

const selectedItem = computed<FolderItem | null>(() => {
  if (selected.value === null || folderItems.value === null) return null;
  return findFolder(selected.value, folderItems.value);
});
</script>
