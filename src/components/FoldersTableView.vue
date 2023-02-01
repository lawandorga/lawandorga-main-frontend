<template>
  <div class="space-y-5">
    <div class="flex items-center px-5 py-2 bg-white rounded shadow">
      <router-link
        class="flex items-center h-6 transition hover:underline group"
        :to="{
          path: $route.path,
          query: { ...$route.query, folder: undefined },
        }"
      >
        <FolderIcon class="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
      </router-link>
      <template v-if="path">
        <template v-for="item in path" :key="item.folder.uuid">
          <div class="mx-2">
            <ChevronRightIcon class="w-5 h-5 text-gray-400" />
          </div>
          <router-link
            class="text-gray-700 transition hover:underline"
            :to="{
              path: $route.path,
              query: { ...$route.query, folder: item.folder.uuid },
            }"
          >
            {{ item.folder.name }}
          </router-link>
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
        />
        <FoldersCreateRootFolder v-if="!selected" :query="query" />
      </template>
      <template #type="{ item }">
        {{ item.folder ? "Folder" : item.repository }}
      </template>
      <template #name="{ item }">
        <div class="flex items-center space-x-2">
          <ButtonLink
            v-if="item.folder"
            :to="{
              path: $route.path,
              query: { ...$route.query, folder: item.folder.uuid },
            }"
          >
            {{ item.folder.name }}
          </ButtonLink>
          <FolderProperty
            v-if="item.folder"
            :property="properties[item.folder.uuid]"
          />
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
import { IAccess, IContent, IFolder, IFolderItem } from "@/types/folders";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { FolderIcon } from "@heroicons/vue/24/outline";
import { TableSortable } from "@lawandorga/components";
import { computed, toRefs } from "vue";
import { useRoute } from "vue-router";
import ButtonLink from "./ButtonLink.vue";
import FolderProperty from "./FolderProperty.vue";
import TableFolderPersonsWithAccess from "./TableFolderPersonsWithAccess.vue";

const props = defineProps<{
  query: () => void;
  folderList: IFolder[];
  folderItems: IFolderItem[];
  availablePersons?: IAccess[];
}>();
const { folderItems } = toRefs(props);

const route = useRoute();

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

const path = computed<IFolderItem[] | null>(() => {
  const folder = route.query.folder as string;
  if (!folder) return null;
  return findFolderPath(folder, folderItems.value);
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
</script>
