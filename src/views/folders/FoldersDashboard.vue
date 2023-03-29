<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar :base="{ name: 'folders-dashboard' }">
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <TabControls
        :default-tab="setting"
        :tabs="[
          { name: 'Tree View', key: 'treeview' },
          { name: 'Table View', key: 'tableview' },
        ]"
        @clicked="tabChanged($event)"
      >
        <template #treeview>
          <FoldersTreeView
            :query="query"
            :available-persons="page?.available_persons"
            :folder-items="folderItems"
          />
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
          means the folder is a record.
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
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { FolderIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import { IFolder, IFolderItem, IFolderPage } from "@/types/folders";
import useGet from "@/composables/useGet";
import { foldersGetFolderPage } from "@/services/folders";
import TabControls from "@/components/TabControls.vue";
import FoldersTableView from "@/components/FoldersTableView.vue";
import FoldersTreeView from "@/components/FoldersTreeView.vue";

// store
const userStore = useUserStore();

// folders
const page = ref<IFolderPage>();
const query = useGet(foldersGetFolderPage, page);

// folder items
const folderItems = computed<IFolderItem[]>(() => {
  if (!page.value) return [];
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

// save tab selection
const setting = userStore.getSetting("foldersDashboardViewTab") as string;
const tabChanged = (key: string) => {
  userStore.updateSetting("foldersDashboardViewTab", key);
};
</script>
