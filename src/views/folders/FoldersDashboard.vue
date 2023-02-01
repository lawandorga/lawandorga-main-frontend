<template>
  <BoxLoader :show="userStore.loaded && !!contentActions && !!foldersActions">
    <div
      v-if="userStore.loaded && !!contentActions && !!foldersActions"
      class="mx-auto space-y-6 max-w-screen-2xl"
    >
      <BreadcrumbsBar :base="{ name: 'folders-dashboard' }">
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <TabControls
        :tabs="[
          { name: 'Tree View', key: 'treeview' },
          { name: 'Table View', key: 'tableview' },
        ]"
      >
        <template #treeview>
          <div class="bg-white divide-y-2 rounded shadow">
            <div class="px-3 py-2">
              <FoldersCreateRootFolder :query="query" />
            </div>
            <div
              class="flex flex-col divide-y xl:divide-y-0 xl:flex-row xl:divide-x"
            >
              <div class="w-full px-6 py-4">
                <FoldersTree
                  :folders="folderItems"
                  @add-child-clicked="
                    parent = $event;
                    foldersActions.createModalOpen = true;
                  "
                  @add-content-clicked="
                    parent = $event;
                    contentActions.addContentModalOpen = true;
                  "
                  @folder-clicked="selected = $event"
                />
              </div>
              <div
                v-if="selectedItem"
                class="w-full px-6 py-4 xl:max-w-xl bg-gray-50"
              >
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
                    Info: This folder has an inheritance stop. That means that
                    persons who have access to its parent will
                    <b>not</b>
                    have access to this folder.
                  </p>
                  <h3 class="mt-4 mb-2 font-medium text-gray-800">
                    Persons with access:
                  </h3>
                  <TableFolderPersonsWithAccess
                    :query="query"
                    :available-persons="page?.available_persons"
                    :item="selectedItem"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #tableview>
          <FoldersTableView
            :query="query"
            :available-persons="page?.available_persons"
            :folder-items="folderItems"
            :folder-list="folderList"
          />
        </template>
      </TabControls>
    </div>
    <div class="inline-block px-3 py-2 mt-10 border shadow-sm bg-gray-50">
      <h2 class="font-medium text-gray-600">Folder properties:</h2>
      <ul class="text-sm text-gray-600">
        <li>
          <span class="font-mono text-sm">(IS)</span>
          stands for inheritance stop.
        </li>
        <li>
          <span class="font-mono">(R)&nbsp;</span>
          means the folder contains a record.
        </li>
        <li>
          <span class="font-mono">(N)&nbsp;</span>
          means you can not see the content of the folder,
          <br />
          <span class="font-mono">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          because you have no access to this folder.
        </li>
      </ul>
    </div>
  </BoxLoader>
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
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { FolderIcon } from "@heroicons/vue/24/outline";
import FoldersCreateFolder from "@/actions/FoldersCreateFolder.vue";
import { computed, ref } from "vue";
import FoldersTree from "@/components/FoldersTree.vue";
import { IFolder, IFolderItem, IFolderPage } from "@/types/folders";
import ButtonClose from "@/components/ButtonClose.vue";
import useGet from "@/composables/useGet";
import { foldersGetFolderPage } from "@/services/folders";
import useQuery from "@/composables/useQuery";
import FoldersCreateRootFolder from "@/actions/FoldersCreateRootFolder.vue";
import FoldersChangeName from "@/actions/FoldersChangeName.vue";
import FoldersToggleInheritance from "@/actions/FoldersToggleInheritance.vue";
import FoldersDeleteFolder from "@/actions/FoldersDeleteFolder.vue";
import FoldersMoveFolder from "@/actions/FoldersMoveFolder.vue";
import TabControls from "@/components/TabControls.vue";
import FoldersTableView from "@/components/FoldersTableView.vue";
import FoldersAddContent from "@/actions/FoldersAddContent.vue";
import TableFolderPersonsWithAccess from "@/components/TableFolderPersonsWithAccess.vue";

// store
const userStore = useUserStore();

// folders
const page = ref<IFolderPage | null>(null);
useGet(foldersGetFolderPage, page);

// query
const query = useQuery(foldersGetFolderPage, page);

// folder items
const folderItems = computed<IFolderItem[]>(() => {
  if (page.value === null) return [];
  return page.value.tree;
});

// folders as list
const pushIntoList = (l: IFolder[], item: IFolderItem) => {
  l.push(item.folder);
  for (let i of item.children) pushIntoList(l, i);
};

const folderList = computed<IFolder[]>(() => {
  if (folderItems.value === null) return [];
  const fl: IFolder[] = [];
  for (let i of folderItems.value) {
    pushIntoList(fl, i);
  }
  return fl;
});

// actions
const contentActions = ref<typeof FoldersCreateFolder>();
const foldersActions = ref<typeof FoldersCreateFolder>();

// parent
const parent = ref<string | null>(null);

// selected folder
const selected = ref<string | null>(null);

const findFolder = (
  id: string,
  folderItems: IFolderItem[],
): IFolderItem | null => {
  for (let i of folderItems) {
    if (i.folder.uuid === selected.value) return i;
    const innerFound = findFolder(id, i.children);
    if (innerFound) return innerFound;
  }
  return null;
};

const selectedItem = computed<IFolderItem | null>(() => {
  if (selected.value === null || folderItems.value === null) return null;
  return findFolder(selected.value, folderItems.value);
});
</script>
