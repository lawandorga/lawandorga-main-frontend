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
    <TableSortable
      :head="[
        { name: 'Name', key: 'name', sortable: true },
        { name: 'Type', key: 'type', sortable: true },
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
      <template #type="{ item }">
        <span v-if="item.folder">Folder</span>
        <div v-else class="flex">
          <FoldersBadge :text="item.repository" />
        </div>
      </template>
      <template #name="{ item }">
        <div class="flex items-center space-x-3">
          <button
            v-if="item.folder"
            class="underline text-lorgablue hover:text-opacity-75"
            @click="folderSelected(item.folder.uuid)"
          >
            {{ item.folder.name }}
          </button>
          <FolderProperty
            v-if="item.folder"
            :property="properties[item.folder.uuid]"
          />
          <ButtonNormal
            v-if="item.folder && item.folder.actions.OPEN"
            kind="action"
            :to="{
              name: 'folders-detail',
              params: { uuid: item.folder.actions.OPEN.uuid },
            }"
          >
            Open
          </ButtonNormal>
          <span v-if="!item.folder">{{ item.name }}</span>
        </div>
      </template>
      <template #action="{ item }">
        <FoldersChangeName
          v-if="item.folder"
          :folder-uuid="item.folder.uuid"
          :folder-name="item.folder.name"
          :query="query"
        />
        <FoldersToggleInheritance
          v-if="item.folder"
          :query="query"
          :folder-uuid="item.folder.uuid"
          :folder-name="item.folder.name"
          :folder-inheritance-stopped="item.folder.stop_inherit"
        />
        <FoldersMoveFolder
          v-if="item.folder"
          :query="query"
          :folder-uuid="item.folder.uuid"
          :available-folders="folderList"
        />
        <FoldersDeleteFolder
          v-if="item.folder"
          :folder-name="item.folder.name"
          :folder-uuid="item.folder.uuid"
          :query="query"
        />
      </template>
    </TableSortable>
    <TableFolderPersonsWithAccess
      v-if="selected"
      :query="query"
      :available-persons="availablePersons"
      :item="selected"
    />
  </div>
</template>

<script setup lang="ts">
import FoldersAddContent from "@/actions/FoldersAddContent.vue";
import FoldersChangeName from "@/actions/FoldersChangeName.vue";
import FoldersCreateFolder from "@/actions/FoldersCreateFolder.vue";
import FoldersCreateRootFolder from "@/actions/FoldersCreateRootFolder.vue";
import FoldersDeleteFolder from "@/actions/FoldersDeleteFolder.vue";
import FoldersMoveFolder from "@/actions/FoldersMoveFolder.vue";
import FoldersToggleInheritance from "@/actions/FoldersToggleInheritance.vue";
import { useFolderProperties } from "@/composables/useFolderProperties";
import { useUserStore } from "@/store/user";
import { IAccess, IContent, IFolder, IFolderItem } from "@/types/folders";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { FolderIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal, TableSortable } from "@lawandorga/components";
import { computed, ref, toRefs } from "vue";
import FolderProperty from "./FolderProperty.vue";
import FoldersBadge from "./FoldersBadge.vue";
import TableFolderPersonsWithAccess from "./TableFolderPersonsWithAccess.vue";

const props = defineProps<{
  query: () => void;
  folderList: IFolder[];
  folderItems: IFolderItem[];
  availablePersons?: IAccess[];
}>();
const { folderItems } = toRefs(props);

const userStore = useUserStore();

const findFolderPath = (
  id: string,
  folderItems: IFolderItem[],
): IFolderItem[] | null => {
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

const path = computed<IFolderItem[] | null>(() => {
  if (selectedFolder.value)
    return findFolderPath(selectedFolder.value, folderItems.value);

  return null;
});

const selected = computed<IFolderItem | null>(() => {
  if (path.value) return path.value[path.value.length - 1];
  return null;
});

const tableFolders = computed<(IFolderItem | IContent)[]>(() => {
  if (selected.value) {
    let items: (IFolderItem | IContent)[] = [];
    items = items.concat(selected.value.children);
    items = items.concat(selected.value.content);
    return items;
  }
  return folderItems.value;
});

const tableFoldersAndPathFolders = computed<(IFolderItem | IContent)[]>(() => {
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
