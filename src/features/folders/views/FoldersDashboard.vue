<script setup lang="ts">
import { FolderIcon } from "@heroicons/vue/24/outline";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import TabControls from "@/components/TabControls.vue";
import FoldersTableView from "@/features/folders/components/FoldersTableView.vue";
import FoldersTreeView from "@/features/folders/components/FoldersTreeView.vue";
import { useUserStore } from "@/store/user";

import { useFolderPage } from "../api/useFolderPage";

const userStore = useUserStore();

const { query, availableGroups, availablePersons, folderItems, folderList } =
  useFolderPage();

const setting = userStore.getSetting("foldersDashboardViewTab") as string;
const tabChanged = (key: string) => {
  userStore.updateSetting("foldersDashboardViewTab", key);
};
</script>

<template>
  <BoxLoader :show="userStore.loaded">
    <div
      v-if="userStore.loaded"
      class="mx-auto max-w-(--breakpoint-2xl) space-y-6"
    >
      <BreadcrumbsBar :base="{ name: 'folders-dashboard' }">
        <FolderIcon class="h-6 w-6" />
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
            :available-persons="availablePersons"
            :available-groups="availableGroups"
            :folder-items="folderItems"
          />
        </template>
        <template #tableview>
          <FoldersTableView
            :query="query"
            :available-persons="availablePersons"
            :available-groups="availableGroups"
            :folder-items="folderItems"
            :folder-list="folderList"
          />
        </template>
      </TabControls>
    </div>
    <div class="mt-10 inline-block border bg-gray-50 px-3 py-2 shadow-sm">
      <h2 class="font-medium text-gray-600">Folder properties:</h2>
      <ul class="text-sm text-gray-600">
        <li>
          <span class="font-mono text-sm">(C)&nbsp;</span>
          stands for access cut from above.
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
