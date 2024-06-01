<template>
  <BoxLoader :show="userStore.loaded">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar
        v-if="!!folder"
        :base="{ name: 'files-dashboard' }"
        :pages="
          folder.path.map((item) => ({
            name: item.name,
            to: { name: 'files-dashboard', params: { id: item.id } },
          }))
        "
      >
        <FolderOpenIcon class="w-6 h-6" />
        <template #buttons>
          <FilesHelp />
          <FilesPermissions />
        </template>
      </BreadcrumbsBar>
      <TableSortable
        :head="[
          { name: '', key: 'type', sortable: true },
          { name: 'Name', key: 'name', sortable: true },
          { name: 'Updated', key: 'last_edited', sortable: true },
          { name: 'Created', key: 'created', sortable: true },
          { name: '', key: 'action' },
        ]"
        :data="items"
        :sort-key="userStore.getSetting('filesSortKey')"
        :sort-order="userStore.getSetting('filesSortOrder')"
        @update:sort-key="userStore.updateSetting('filesSortKey', $event)"
        @update:sort-order="userStore.updateSetting('filesSortOrder', $event)"
      >
        <template #head-action>
          <ButtonNormal
            kind="action"
            @click="foldersCreateFolderModalOpen = true"
          >
            Create Folder
          </ButtonNormal>
          <ButtonNormal kind="action" @click="createFileModalOpen = true">
            Upload File
          </ButtonNormal>
        </template>
        <template #type="{ item: slotProps }">
          <FolderIcon
            v-if="slotProps.type === 'FOLDER'"
            class="w-5 h-5 text-gray-500"
          />
          <DocumentIcon
            v-if="slotProps.type === 'FILE'"
            class="w-5 h-5 text-gray-500"
          />
        </template>
        <template #name="{ item: slotProps }">
          <ButtonLink
            v-if="slotProps.type === 'FOLDER'"
            :to="{
              name: 'files-dashboard',
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
          <div v-else class="">
            {{ slotProps.name }}
            <span v-if="!slotProps.exists" class="text-red-600">(ERROR)</span>
          </div>
        </template>
        <template #last_edited="{ item: slotProps }">
          {{ formatDate(slotProps.last_edited) }}
        </template>
        <template #created="{ item: slotProps }">
          {{ formatDate(slotProps.created) }}
        </template>
        <template #action="{ item: slotProps }">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="slotProps.type === 'FOLDER'"
              size="xs"
              kind="action"
              @click="
                folderOpen = slotProps;
                updateFolderModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              v-if="slotProps.type === 'FOLDER'"
              size="xs"
              kind="delete"
              @click="
                folderOpen = slotProps;
                foldersDeleteFolderModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
            <ButtonNormal
              v-if="slotProps.type === 'FILE'"
              size="xs"
              kind="action"
              @click="downloadFile(slotProps)"
            >
              Download
            </ButtonNormal>
            <ButtonNormal
              v-if="slotProps.type === 'FILE'"
              size="xs"
              kind="action"
              @click="
                fileOpen = slotProps;
                updateFileModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              v-if="slotProps.type === 'FILE'"
              size="xs"
              kind="delete"
              @click="
                fileOpen = slotProps;
                deleteFileModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableSortable>
      <TableGenerator
        :head="[
          { name: 'Permission', key: 'type' },
          { name: 'Group', key: (obj) => obj.group_has_permission?.name },
          { name: 'Source', key: 'folder' },
          { name: '', key: 'action' },
        ]"
        :data="folderPermissions"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createPermissionModalOpen = true"
            >
              Add Permission
            </ButtonNormal>
          </div>
        </template>
        <template #folder="slotProps">
          <router-link
            :to="{
              name: 'files-dashboard',
              params: { id: slotProps.folder.id },
            }"
            class="underline"
          >
            {{ slotProps.folder.name }}
          </router-link>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonNormal
              v-if="slotProps.source === 'NORMAL'"
              type="button"
              size="xs"
              kind="delete"
              @click="
                permissionOpen = slotProps;
                deletePermissionModalOpen = true;
              "
            >
              Remove
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- folder -->
    <ModalFree v-model="foldersCreateFolderModalOpen" title="Create Folder">
      <FormGenerator
        :fields="folderFields"
        :request="foldersCreateFolderRequest"
        :data="{ parent: folder.id }"
      />
    </ModalFree>
    <ModalFree v-model="updateFolderModalOpen" title="Update Folder">
      <FormGenerator
        :fields="folderFields"
        :data="folderOpen"
        :request="updateFolderRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="foldersDeleteFolderModalOpen"
      :request="foldersDeleteFolderRequest"
      :data="folderOpen"
    />
    <!-- file -->
    <ModalFree v-model="createFileModalOpen" title="Create File">
      <FormGenerator
        :fields="createFileFields"
        :request="createFileRequest"
        :data="{ folder: folder?.id }"
      />
    </ModalFree>
    <ModalFree v-model="updateFileModalOpen" title="Update File">
      <FormGenerator
        :fields="updateFileFields"
        :data="fileOpen"
        :request="updateFileRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteFileModalOpen"
      :request="deleteFileRequest"
      :data="fileOpen"
    />
    <!-- permission -->
    <ModalFree v-model="createPermissionModalOpen" title="Add Permission">
      <FormGenerator
        :fields="permissionFields"
        :request="createPermissionRequest"
        :data="{ folder: folder?.id }"
      />
    </ModalFree>
    <ModalDelete
      v-model="deletePermissionModalOpen"
      :request="deletePermissionRequest"
      :data="permissionOpen"
    />
  </BoxLoader>
</template>

<script lang="ts">
import {
  FilesFolder,
  FilesFile,
  FilesPermission,
  FilesPossiblePermission,
} from "@/features/z_deprecated_files/types";
import { defineComponent, Ref, ref, watch } from "vue";
import FilesService from "./files_service";
import {
  TableGenerator,
  TableSortable,
  ButtonNormal,
  ModalFree,
  FormGenerator,
  ModalDelete,
} from "lorga-ui";
import BoxLoader from "@/components/BoxLoader.vue";
import { onBeforeRouteUpdate, RouteLocation, useRoute } from "vue-router";
import CoreService from "@/features/z_deprecated_files/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { FolderOpenIcon } from "@heroicons/vue/24/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/vue/20/solid";
import { formatDate } from "@/utils/date";
import ButtonLink from "@/components/ButtonLink.vue";
import useCreate from "@/composables/useCreate";
import useUpdate from "@/composables/useUpdate";
import useDelete from "@/composables/useDelete";
import useGet from "@/composables/useGet";
import { DjangoModel } from "@/types_deprecated/shared";
import FilesPermissions from "@/features/z_deprecated_files/FilesPermissions.vue";
import FilesHelp from "@/features/z_deprecated_files/FilesHelp.vue";
import { useUserStore } from "@/store/user";
import { useErrorHandling } from "@/api/errors";

export default defineComponent({
  components: {
    FilesHelp,
    FilesPermissions,
    ButtonLink,
    FolderIcon,
    DocumentIcon,
    TableSortable,
    FolderOpenIcon,
    BreadcrumbsBar,
    ModalDelete,
    TableGenerator,
    ButtonNormal,
    BoxLoader,
    ModalFree,
    FormGenerator,
  },
  setup() {
    // general
    const route = useRoute();

    // items
    const folder = ref<FilesFolder | null>(null);
    const items = ref<(FilesFolder | FilesFile)[] | null>(null);
    const folderPermissions = ref<FilesPermission[] | null>(null);

    // files and folders
    useGet(FilesService.getItems, items, folder);

    const { handleQueryError } = useErrorHandling();

    const getFolder = (route: RouteLocation) => {
      if (route.params.id)
        FilesService.getFolder(route.params.id as string)
          .then((f) => (folder.value = f))
          .catch(handleQueryError);
      else
        FilesService.getFirstFolder()
          .then((f) => (folder.value = f))
          .catch(handleQueryError);
    };

    onBeforeRouteUpdate((to) => {
      items.value = null;
      folderPermissions.value = null;
      getFolder(to);
    });

    getFolder(route);

    watch(folder, () => {
      if (folder.value === null) return;
      FilesService.getPermissions(folder.value).then(
        (permissions) => (folderPermissions.value = permissions),
      );
    });

    const userStore = useUserStore();

    return {
      userStore,
      // utils
      formatDate: formatDate,
      // current folder
      folder,
      // items
      items,
      // folder permissions
      folderPermissions,
      // folder
      ...createUpdateDeleteFolder(items, folder),
      // folder permission
      ...createDeletePermission(folderPermissions),
      // file
      ...createUpdateDeleteFile(items, folder),
    };
  },
  methods: {
    // file download
    downloadFile(file: FilesFile) {
      FilesService.downloadFile(file);
    },
  },
});

function createUpdateDeleteFolder(
  items: Ref<(FilesFolder | FilesFile)[] | null>,
  currentFolder: Ref<FilesFolder | null>,
) {
  const folderOpen = ref<FilesFolder | null>(null);

  // helper
  const removeFolderFromItemsIfParentMismatches = (folder: FilesFolder) => {
    if (items.value === null || currentFolder.value === null) return folder;

    const index = items.value.findIndex((item) => item.id === folder.id);
    if (index !== -1 && folder.parent !== currentFolder.value.id)
      items.value.splice(index, 1);

    return folder;
  };

  // create
  const folderFields = ref([
    {
      label: "Parent",
      type: "select",
      name: "parent",
      required: true,
      options: [] as FilesFolder[],
    },
    {
      label: "Name",
      type: "text",
      name: "name",
      required: true,
    },
  ]);
  const { createRequest, createModalOpen: foldersCreateFolderModalOpen } =
    useCreate(FilesService.foldersCreateFolder, items);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const foldersCreateFolderRequest = (data: Record<string, any>) =>
    createRequest(data).then(removeFolderFromItemsIfParentMismatches);

  // update
  const { updateRequest, updateModalOpen: updateFolderModalOpen } = useUpdate(
    FilesService.updateFolder,
    items,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFolderRequest = (data: Record<string, any>) =>
    updateRequest(data).then(removeFolderFromItemsIfParentMismatches);

  // create and update
  watch([foldersCreateFolderModalOpen, updateFolderModalOpen], () => {
    FilesService.getFolders().then(
      (items) => (folderFields.value[0].options = items),
    );
  });

  // delete
  const {
    deleteRequest: foldersDeleteFolderRequest,
    deleteModalOpen: foldersDeleteFolderModalOpen,
  } = useDelete(FilesService.foldersDeleteFolder, items);

  return {
    // current
    folderOpen,
    // create
    folderFields,
    foldersCreateFolderRequest,
    foldersCreateFolderModalOpen,
    // update
    updateFolderRequest,
    updateFolderModalOpen,
    // delete
    foldersDeleteFolderRequest,
    foldersDeleteFolderModalOpen,
  };
}

function createDeletePermission(permissions: Ref<FilesPermission[] | null>) {
  const permissionOpen = ref(null);

  // create
  const permissionFields = ref([
    {
      label: "Permission",
      type: "select",
      name: "permission",
      options: [],
      required: true,
    },
    {
      label: "Group",
      type: "select",
      name: "group_has_permission",
      options: [] as FilesPossiblePermission[],
    },
  ]);
  const {
    createRequest: createPermissionRequest,
    createModalOpen: createPermissionModalOpen,
  } = useCreate(FilesService.createPermission, permissions);

  watch(createPermissionModalOpen, () => {
    FilesService.getPossiblePermissions().then(
      (possiblePermissions) =>
        (permissionFields.value[0].options = possiblePermissions),
    );
    CoreService.getGroups().then(
      (groups) => (permissionFields.value[1].options = groups),
    );
  });

  // delete
  const {
    deleteRequest: deletePermissionRequest,
    deleteModalOpen: deletePermissionModalOpen,
  } = useDelete(FilesService.deletePermission, permissions);

  return {
    // current
    permissionOpen,
    // create
    permissionFields,
    createPermissionRequest,
    createPermissionModalOpen,
    // delete
    deletePermissionRequest,
    deletePermissionModalOpen,
  };
}

function createUpdateDeleteFile(
  items: Ref<(FilesFolder | FilesFile)[] | null>,
  currentFolder: Ref<FilesFolder | null>,
) {
  const fileOpen = ref(null);

  // helper
  const removeFileFromItemsIfParentMismatches = (file: FilesFile) => {
    if (items.value === null || currentFolder.value === null) return file;

    const index = items.value.findIndex(
      (item) => item.id === file.id && item.type === file.type,
    );
    if (index !== -1 && file.folder !== currentFolder.value.id)
      items.value.splice(index, 1);

    return file;
  };

  // create
  const createFileFields = ref([
    {
      label: "File",
      type: "file",
      name: "file",
      required: true,
    },
  ]);
  const {
    createRequest: createFileRequest,
    createModalOpen: createFileModalOpen,
  } = useCreate(FilesService.createFile, items);

  // const { createRequest, createModalOpen: createFileModalOpen } = useCreate(
  //     FilesService.createFile,
  //     items,
  //   );
  //   const createFileRequest = (data: JsonModel) => {
  //     const formData = new FormData();
  //     formData.append("folder", (data.folder as number).toString());
  //     return createRequest(formData);
  //   };

  // update
  const updateFileFields = ref([
    {
      label: "Folder",
      type: "select",
      name: "folder",
      required: true,
      options: [] as FilesFolder[],
    },
    {
      label: "Name",
      type: "text",
      name: "name",
      required: true,
    },
  ]);
  const { updateRequest, updateModalOpen: updateFileModalOpen } = useUpdate(
    FilesService.updateFile,
    items,
  );
  const updateFileRequest = (data: DjangoModel) =>
    updateRequest(data).then(removeFileFromItemsIfParentMismatches);

  watch(updateFileModalOpen, () => {
    FilesService.getFolders().then(
      (items) => (updateFileFields.value[0].options = items),
    );
  });

  // delete
  const {
    deleteRequest: deleteFileRequest,
    deleteModalOpen: deleteFileModalOpen,
  } = useDelete(FilesService.deleteFile, items);

  return {
    // current
    fileOpen,
    // create
    createFileFields,
    createFileRequest,
    createFileModalOpen,
    // update
    updateFileFields,
    updateFileRequest,
    updateFileModalOpen,
    // delete
    deleteFileRequest,
    deleteFileModalOpen,
  };
}
</script>
