<script setup lang="ts">
import FoldersAddContent from "@/features/folders/actions/AddContent.vue";
import FoldersChangeName from "@/features/folders/actions/ChangeName.vue";
import FoldersCreateFolder from "@/features/folders/actions/CreateFolder.vue";
import FoldersCreateRootFolder from "@/features/folders/actions/CreateRootFolder.vue";
import FoldersDeleteFolder from "@/features/folders/actions/DeleteFolder.vue";
import FoldersMoveFolder from "@/features/folders/actions/MoveFolder.vue";
import FoldersToggleInheritance from "@/features/folders/actions/ToggleInheritance.vue";
import { useFolderProperties } from "@/composables/useFolderProperties";
import { useUserStore } from "@/store/user";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { FolderIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal, TableGenerator } from "lorga-ui";
import { computed, ref, toRefs } from "vue";
import FolderProperty from "./FolderProperty.vue";
import FoldersBadge from "./FoldersBadge.vue";
import TableFolderPersonsWithAccess from "./TableFolderPersonsWithAccess.vue";
import TableFolderGroupsWithAccess from "./TableFolderGroupsWithAccess.vue";
import {
  Content,
  Folder,
  FolderGroup,
  FolderItem,
  FolderPerson,
} from "../api/useFolderPage";

const props = defineProps<{
  query: () => void;
  folderList: Folder[];
  folderItems: FolderItem[];
  availablePersons: FolderPerson[];
  availableGroups: FolderGroup[];
}>();
const { folderItems } = toRefs(props);

const userStore = useUserStore();

const findFolderPath = (
  id: string,
  folderItems: FolderItem[],
): FolderItem[] | null => {
  for (let i of folderItems) {
    if (i.folder.uuid === id) return [i];
    const innerFound = findFolderPath(id, i.children);
    if (innerFound) return [i, ...innerFound];
  }
  return null;
};

const selectedFolderInTableView = userStore.getSetting(
  "selectedFolderInTableView",
  undefined,
) as string | undefined;

const selectedFolder = ref<string | undefined>(selectedFolderInTableView);

const path = computed<FolderItem[] | null>(() => {
  if (selectedFolder.value)
    return findFolderPath(selectedFolder.value, folderItems.value);

  return null;
});

const selected = computed<FolderItem | null>(() => {
  if (path.value) return path.value[path.value.length - 1];
  return null;
});

const tableFolders = computed<(FolderItem | Content)[]>(() => {
  if (selected.value) {
    let items: (FolderItem | Content)[] = [];
    items = items.concat(selected.value.children);
    const content = selected.value.content.filter(
      (c) => c.repository !== "RECORDS_RECORD",
    );
    items = items.concat(content);
    return items;
  }
  return folderItems.value;
});

const tableFoldersAndPathFolders = computed<(FolderItem | Content)[]>(() => {
  if (tableFolders.value && path.value)
    return tableFolders.value.concat(path.value);
  return [];
});

const { properties } = useFolderProperties(tableFoldersAndPathFolders);

const folderSelected = (uuid: string | undefined) => {
  selectedFolder.value = uuid;
  userStore.updateSetting("selectedFolderInTableView", uuid || "");
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center px-5 py-2 bg-white rounded shadow">
      <button
        class="flex items-center h-6 transition hover:underline group"
        @click="folderSelected(undefined)"
      >
        <FolderIcon class="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
      </button>
      <template v-if="path">
        <template v-for="item in path" :key="item.folder.uuid">
          <div class="mx-2">
            <ChevronRightIcon class="w-5 h-5 text-gray-400" />
          </div>
          <button
            class="text-gray-700 transition hover:underline"
            @click="folderSelected(item.folder.uuid)"
          >
            {{ item.folder.name }}
          </button>
          <FolderProperty
            class="ml-3"
            :property="properties[item.folder.uuid]"
          />
        </template>
      </template>
    </div>
    <TableGenerator
      :head="[
        { name: 'Name', key: 'name' },
        { name: 'Type', key: 'type' },
        { name: '', key: 'action' },
      ]"
      :data="tableFolders"
    >
      <template #head-action="{}">
        <FoldersAddContent
          v-if="selected"
          :folder-uuid="selected.folder.uuid"
          :query="query"
        />
        <FoldersCreateFolder
          v-if="selected"
          :query="query"
          :parent="selected.folder.uuid"
        />
        <FoldersToggleInheritance
          v-if="selected"
          :query="query"
          :folder-uuid="selected.folder.uuid"
          :folder-name="selected.folder.name"
          :folder-inheritance-stopped="selected.folder.stop_inherit"
        />
        <FoldersCreateRootFolder v-if="!selected" :query="query" />
      </template>
      <template #name="{ i }">
        <div class="flex items-center space-x-3">
          <button
            v-if="i.folder"
            class="underline text-formcolor hover:text-black/75"
            @click="folderSelected(i.folder.uuid)"
          >
            {{ i.folder.name }}
          </button>
          <FolderProperty
            v-if="i.folder"
            :property="properties[i.folder.uuid]"
          />
          <ButtonNormal
            v-if="i.folder && i.folder.actions.includes('OPEN')"
            kind="action"
            :to="{
              name: 'folders-detail',
              params: { uuid: i.folder.uuid },
            }"
          >
            Open
          </ButtonNormal>
          <div v-if="!i.folder" class="flex items-center">
            <span class="block">{{ i.name }}</span>
            <div class="ml-3">
              <ButtonNormal
                kind="action"
                :to="{
                  name: 'folders-detail',
                  params: { uuid: selected?.folder.uuid },
                  query: {
                    selectedType: i.repository,
                    selectedId: i.uuid,
                  },
                }"
              >
                Open
              </ButtonNormal>
            </div>
          </div>
        </div>
      </template>
      <template #type="{ i }">
        <span v-if="i.folder">Folder</span>
        <div v-else class="flex">
          <FoldersBadge :text="i.repository" />
        </div>
      </template>
      <template #action="{ i }">
        <FoldersChangeName
          v-if="i.folder"
          :folder-uuid="i.folder.uuid"
          :folder-name="i.folder.name"
          :query="query"
        />
        <FoldersToggleInheritance
          v-if="i.folder"
          :query="query"
          :folder-uuid="i.folder.uuid"
          :folder-name="i.folder.name"
          :folder-inheritance-stopped="i.folder.stop_inherit"
        />
        <FoldersMoveFolder
          v-if="i.folder"
          :query="query"
          :folder-uuid="i.folder.uuid"
          :available-folders="folderList"
        />
        <FoldersDeleteFolder
          v-if="i.folder"
          :folder-name="i.folder.name"
          :folder-uuid="i.folder.uuid"
          :query="query"
        />
      </template>
    </TableGenerator>
    <TableFolderPersonsWithAccess
      v-if="selected"
      :query="query"
      :available-persons="availablePersons"
      :item="selected"
    />
    <TableFolderGroupsWithAccess
      v-if="selected"
      :query="query"
      :available-groups="availableGroups"
      :item="selected"
    />
  </div>
</template>
