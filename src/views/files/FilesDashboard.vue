<template>
  <BoxLoader :show="true">
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
      <TableGenerator
        :head="[
          { name: '', key: 'type' },
          { name: 'Name', key: 'name' },
          { name: 'Updated', key: 'last_edited' },
          { name: 'Created', key: 'created' },
          { name: '', key: 'action' },
        ]"
        :data="items"
      >
        <template #head-action>
          <ButtonNormal kind="action" @click="createFolderModalOpen = true">
            Create Folder
          </ButtonNormal>
          <ButtonNormal kind="action" @click="createFileModalOpen = true">
            Upload File
          </ButtonNormal>
        </template>
        <template #type="slotProps">
          <FolderIcon
            v-if="slotProps.type === 'FOLDER'"
            class="w-5 h-5 text-gray-500"
          />
          <DocumentIcon
            v-if="slotProps.type === 'FILE'"
            class="w-5 h-5 text-gray-500"
          />
        </template>
        <template #name="slotProps">
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
        <template #last_edited="slotProps">
          {{ formatDate(slotProps.last_edited) }}
        </template>
        <template #created="slotProps">
          {{ formatDate(slotProps.created) }}
        </template>
        <template #action="slotProps">
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
                deleteFolderModalOpen = true;
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
      </TableGenerator>
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
    <ModalFree v-model="createFolderModalOpen" title="Create Folder">
      <FormGenerator
        :fields="folderFields"
        :request="createFolderRequest"
        :initial="{ parent: folder.id }"
      />
    </ModalFree>
    <ModalFree v-model="updateFolderModalOpen" title="Update Folder">
      <FormGenerator
        :fields="folderFields"
        :initial="folderOpen"
        :request="updateFolderRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteFolderModalOpen"
      :request="deleteFolderRequest"
      :object="folderOpen"
    />
    <!-- file -->
    <ModalFree v-model="createFileModalOpen" title="Create File">
      <FormGenerator
        :fields="createFileFields"
        :request="createFileRequest"
        :initial="{ folder: folder.id }"
      />
    </ModalFree>
    <ModalFree v-model="updateFileModalOpen" title="Update File">
      <FormGenerator
        :fields="updateFileFields"
        :initial="fileOpen"
        :request="updateFileRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteFileModalOpen"
      :request="deleteFileRequest"
      :object="fileOpen"
    />
    <!-- permission -->
    <ModalFree v-model="createPermissionModalOpen" title="Add Permission">
      <FormGenerator
        :fields="permissionFields"
        :request="createPermissionRequest"
        :initial="{ folder: folder.id }"
      />
    </ModalFree>
    <ModalDelete
      v-model="deletePermissionModalOpen"
      :request="deletePermissionRequest"
      :object="permissionOpen"
    />
  </BoxLoader>
</template>

<script lang="ts">
import {
  FilesFolder,
  FilesFile,
  FilesPermission,
  FilesPossiblePermission,
} from "@/types/files";
import { defineComponent, Ref, ref, watch } from "vue";
import FilesService from "@/services/files";
import { TableGenerator } from "@lawandorga/components";
import { ButtonNormal } from "@lawandorga/components";
import BoxLoader from "@/components/BoxLoader.vue";
import { ModalFree } from "@lawandorga/components";
import { FormGenerator } from "@lawandorga/components";
import { ModalDelete } from "@lawandorga/components";
import { onBeforeRouteUpdate, RouteLocation, useRoute } from "vue-router";
import CoreService from "@/services/core";
import { Group } from "@/types/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { FolderOpenIcon } from "@heroicons/vue/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/vue/solid";
import { formatDate } from "@/utils/date";
import BoxAlert from "@/components/BoxAlert.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import useCreateItem from "@/composables/useCreateItem";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useGet from "@/composables/useGet";
import { DjangoModel } from "@/types/shared";
import FilesPermissions from "@/components/FilesPermissions.vue";
import FilesHelp from "@/components/FilesHelp.vue";

export default defineComponent({
  components: {
    FilesHelp,
    FilesPermissions,
    ButtonLink,
    BoxAlert,
    FolderIcon,
    DocumentIcon,
    FolderOpenIcon, // eslint-disable-line vue/no-unused-components
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

    const getFolder = (route: RouteLocation) => {
      if (route.params.id)
        FilesService.getFolder(route.params.id as string).then(
          (f) => (folder.value = f),
        );
      else FilesService.getFirstFolder().then((f) => (folder.value = f));
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

    return {
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
  const folderOpen = ref(null);

  // helper
  const removeFolderFromItemsIfParentMismatches = (folder: FilesFolder) => {
    if (items.value === null || currentFolder.value === null) return folder;

    let index = items.value.findIndex((item) => item.id === folder.id);
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
  const { createRequest, createModalOpen: createFolderModalOpen } =
    useCreateItem(FilesService.createFolder, items);

  const createFolderRequest = (data: DjangoModel) =>
    createRequest(data).then(removeFolderFromItemsIfParentMismatches);

  // update
  const { updateRequest, updateModalOpen: updateFolderModalOpen } =
    useUpdateItem(FilesService.updateFolder, items);
  const updateFolderRequest = (data: DjangoModel) =>
    updateRequest(data).then(removeFolderFromItemsIfParentMismatches);

  // create and update
  watch([createFolderModalOpen, updateFolderModalOpen], () => {
    FilesService.getFolders().then(
      (items) => (folderFields.value[0].options = items),
    );
  });

  // delete
  const {
    deleteRequest: deleteFolderRequest,
    deleteModalOpen: deleteFolderModalOpen,
  } = useDeleteItem(FilesService.deleteFolder, items);

  return {
    // current
    folderOpen,
    // create
    folderFields,
    createFolderRequest,
    createFolderModalOpen,
    // update
    updateFolderRequest,
    updateFolderModalOpen,
    // delete
    deleteFolderRequest,
    deleteFolderModalOpen,
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
      options: [] as Group[],
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
  } = useCreateItem(FilesService.createPermission, permissions);

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
  } = useDeleteItem(FilesService.deletePermission, permissions);

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

    let index = items.value.findIndex(
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
  } = useCreateItem(FilesService.createFile, items);

  // const { createRequest, createModalOpen: createFileModalOpen } = useCreateItem(
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
  const { updateRequest, updateModalOpen: updateFileModalOpen } = useUpdateItem(
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
  } = useDeleteItem(FilesService.deleteFile, items);

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
