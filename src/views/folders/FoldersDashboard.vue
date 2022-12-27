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
                addContentModalOpen = true;
              "
              @folder-clicked="selected = $event"
            />
            <div
              class="inline-block px-3 py-2 mt-10 border shadow-sm bg-gray-50"
            >
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
              </ul>
            </div>
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
              <TableGenerator
                :data="selectedItem.access"
                :head="[
                  { name: 'Name', key: 'name' },
                  { name: 'Source', key: 'source' },
                  { name: '', key: 'action' },
                ]"
              >
                <template #head-action>
                  <ButtonNormal
                    kind="action"
                    @click="
                      foldersActions.temporary = selectedItem;
                      foldersActions.grantAccessModalOpen = true;
                    "
                  >
                    Grant access
                  </ButtonNormal>
                </template>
                <template #action="item">
                  <ButtonNormal
                    v-if="item.actions.REVOKE_ACCESS"
                    kind="delete"
                    @click="
                      foldersActions.temporary = {
                        user_uuid: item.actions.REVOKE_ACCESS.user_uuid,
                        uuid: selectedItem.folder.uuid,
                        access: selectedItem.access,
                        url: item.actions.REVOKE_ACCESS.url,
                      };
                      foldersActions.revokeAccessModalOpen = true;
                    "
                  >
                    Revoke access
                  </ButtonNormal>
                </template>
              </TableGenerator>
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
  <ActionsRecords ref="recordsActions" :query="query" />
  <Dialog
    :open="addContentModalOpen"
    title="Add content"
    as="div"
    class="fixed inset-0 z-30"
    @close="addContentModalOpen = false"
  >
    <div class="fixed inset-0 bg-black/25" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-full">
        <DialogPanel class="w-72">
          <div
            class="w-full bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
          >
            <div v-if="recordsActions" class="px-1 py-1">
              <div>
                <button
                  :class="[
                    'focus:bg-lorgablue focus:text-white focus:outline-none',
                    'text-gray-900',
                    'group flex w-full items-center rounded-md px-4 py-2 text-sm',
                  ]"
                  @click="
                    close();
                    recordsActions.createWithinFolderModalOpen = true;
                    recordsActions.temporary = { folder: parent };
                  "
                >
                  Record
                </button>
              </div>
            </div>
            <div class="px-1 py-1">
              <div>
                <button
                  :class="[
                    'focus:bg-lorgablue focus:text-white focus:outline-none',
                    'text-gray-900',
                    'group flex w-full items-center rounded-md px-4 py-2 text-sm',
                  ]"
                  @click="
                    close();
                    filesUploadFile.commandModalOpen = true;
                  "
                >
                  File
                </button>
              </div>
            </div>
            <div class="px-1 py-1">
              <div>
                <button
                  :class="[
                    'focus:bg-lorgablue focus:text-white focus:outline-none',
                    'text-gray-900',
                    'group flex w-full items-center rounded-md px-4 py-2 text-sm',
                  ]"
                  @click="
                    close();
                    filesUploadMultipleFiles.commandModalOpen = true;
                  "
                >
                  Multiple Files
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
  <FilesUploadFile
    ref="filesUploadFile"
    class="hidden"
    :query="query"
    :folder-uuid="parent ? parent : undefined"
  />
  <FilesUploadMultipleFiles
    ref="filesUploadMultipleFiles"
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
import ActionsFolders from "@/components/ActionsFolders.vue";
import { computed, ref } from "vue";
import { ButtonNormal, TableGenerator } from "@lawandorga/components";
import FoldersTree from "@/components/FoldersTree.vue";
import { IFolder, IFolderItem, IFolderPage } from "@/types/folders";
import ButtonClose from "@/components/ButtonClose.vue";
import useGet from "@/composables/useGet";
import { foldersGetFolderPage } from "@/services/folders";
import useQuery from "@/composables/useQuery";
import { Dialog, DialogPanel } from "@headlessui/vue";
import ActionsRecords from "@/components/ActionsRecords.vue";
import FilesUploadFile from "@/actions/FilesUploadFile.vue";
import FilesUploadMultipleFiles from "@/actions/FilesUploadMultipleFiles.vue";

// content
const addContentModalOpen = ref(false);
function close() {
  addContentModalOpen.value = false;
}

// records
const recordsActions = ref<typeof ActionsRecords>();
const filesUploadFile = ref();
const filesUploadMultipleFiles = ref();

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
