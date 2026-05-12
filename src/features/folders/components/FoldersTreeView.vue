<script setup lang="ts">
import { computed, ref, toRefs } from "vue";

import ButtonClose from "@/components/ButtonClose.vue";
import FoldersAddContent from "@/features/folders/actions/AddContent.vue";
import FoldersChangeName from "@/features/folders/actions/ChangeName.vue";
import FoldersCreateFolder from "@/features/folders/actions/CreateFolder.vue";
import FoldersCreateRootFolder from "@/features/folders/actions/CreateRootFolder.vue";
import FoldersDeleteFolder from "@/features/folders/actions/DeleteFolder.vue";
import FoldersMoveFolder from "@/features/folders/actions/MoveFolder.vue";
import FoldersToggleInheritance from "@/features/folders/actions/ToggleInheritance.vue";
import FoldersTree from "@/features/folders/components/FoldersTree.vue";
import TableFolderPersonsWithAccess from "@/features/folders/components/TableFolderPersonsWithAccess.vue";

import {
  Folder,
  FolderGroup,
  FolderItem,
  FolderPerson,
} from "../api/useFolderPage";
import TableFolderGroupsWithAccess from "./TableFolderGroupsWithAccess.vue";

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

<template>
  <div
    v-if="!!foldersActions && !!contentActions"
    class="divide-y-2 divide-gray-100 rounded bg-white shadow"
  >
    <div class="px-3 py-2">
      <FoldersCreateRootFolder :query="query" />
    </div>
    <div
      class="flex flex-col divide-y xl:flex-row xl:divide-x xl:divide-y-0 xl:divide-gray-300"
    >
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
      <div v-if="selectedItem" class="w-full bg-gray-50 px-6 py-4 xl:max-w-xl">
        <div class="sticky top-0">
          <div class="flex justify-between">
            <h2 class="truncate text-lg font-medium text-gray-800">
              {{ selectedItem.folder.name }}
            </h2>
            <ButtonClose @click="selected = null" />
          </div>

          <div class="mt-2 flex space-x-3">
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
  <div class="hidden">
    <FoldersCreateFolder ref="foldersActions" :query="query" :parent="parent" />
    <FoldersAddContent
      ref="contentActions"
      :query="query"
      :folder-uuid="parent ? parent : undefined"
    />
  </div>
</template>
