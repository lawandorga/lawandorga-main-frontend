<template>
  <BoxLoader :show="userStore.loaded && !!foldersActions">
    <div
      v-if="userStore.loaded && !!foldersActions"
      class="mx-auto space-y-6 max-w-screen-2xl"
    >
      <BreadcrumbsBar :base="{ name: 'folders-dashboard' }">
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="bg-white divide-y-2 rounded shadow">
        <div class="px-3 py-2">
          <ButtonNormal
            kind="action"
            @click="
              parent = null;
              foldersActions.createModalOpen = true;
            "
          >
            Create Root Folder
          </ButtonNormal>
        </div>
        <div class="px-6 py-4">
          <FoldersTree
            :folders="folderItems"
            @create-clicked="
              parent = $event;
              foldersActions.createModalOpen = true;
            "
            @folder-clicked="selected = $event"
          />
        </div>
        <div v-if="selectedItem" class="px-6 py-4">
          <div class="">
            <div class="flex justify-between">
              <h2 class="text-lg font-medium text-gray-800">
                {{ selectedItem.folder.name }}
              </h2>
              <ButtonClose @click="selected = null" />
            </div>
            <div class="flex mt-2 space-x-3">
              <ButtonNormal
                kind="action"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.updateModalOpen = true;
                "
              >
                Change name
              </ButtonNormal>
              <ButtonNormal
                kind="action"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.toggleInheritanceModalOpen = true;
                "
              >
                Toggle inheritance
              </ButtonNormal>
              <ButtonNormal
                kind="action"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.moveFolderModalOpen = true;
                "
              >
                Move
              </ButtonNormal>
              <ButtonNormal
                kind="delete"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.deleteModalOpen = true;
                "
              >
                Delete
              </ButtonNormal>
            </div>
            <p class="mt-4">
              The following persons have access to this folder:
              {{ selectedItem.access.map((i) => i.name).join(", ") }}
            </p>
            <div class="flex mt-1 space-x-3">
              <ButtonNormal
                kind="action"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.grantAccessModalOpen = true;
                "
              >
                Grant access
              </ButtonNormal>
              <ButtonNormal
                kind="delete"
                @click="
                  foldersActions.temporary = selectedItem;
                  foldersActions.revokeAccessModalOpen = true;
                "
              >
                Revoke access
              </ButtonNormal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
  <ActionsFolders
    ref="foldersActions"
    :parent="parent"
    :query="query"
    :available-persons="page ? page.available_persons : null"
    :available-folders="folderList"
  />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { FolderIcon } from "@heroicons/vue/24/outline";
import ActionsFolders from "@/components/ActionsFolders.vue";
import { computed, ref } from "vue";
import { ButtonNormal } from "@lawandorga/components";
import FoldersTree from "@/components/FoldersTree.vue";
import { IFolder, IFolderItem, IFolderPage } from "@/types/folders";
import ButtonClose from "@/components/ButtonClose.vue";
import useGet from "@/composables/useGet";
import { foldersGetFolderPage } from "@/services/folders";
import useQuery from "@/composables/useQuery";

// store
const userStore = useUserStore();

// folders
const page = ref<IFolderPage | null>(null);
useGet(foldersGetFolderPage, page);

// query
const query = useQuery(foldersGetFolderPage, page);

// folder items
const folderItems = computed<IFolderItem[] | null>(() => {
  if (page.value === null) return null;
  return page.value.tree;
});

// folders as list
const pushIntoList = (l: IFolder[], item: IFolderItem) => {
  l.push(item.folder);
  for (let i of item.children) pushIntoList(l, i);
};

const folderList = computed<IFolder[] | null>(() => {
  if (folderItems.value === null) return null;
  const fl: IFolder[] = [];
  for (let i of folderItems.value) {
    pushIntoList(fl, i);
  }
  return fl;
});

// actions
const foldersActions = ref<typeof ActionsFolders>();

// parent
const parent = ref<string | null>(null);

// selected folder
const selected = ref<string | null>(null);

const findFolder = (
  id: string,
  folderItems: IFolderItem[],
): IFolderItem | null => {
  for (let i of folderItems) {
    if (i.folder.id === selected.value) return i;
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
