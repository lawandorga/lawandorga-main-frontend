<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-2xl mx-auto space-y-6">
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
          <ButtonBreadcrumbs @click="helpModalOpen = true">
            Show Help
          </ButtonBreadcrumbs>
          <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
            Show General Permissions
          </ButtonBreadcrumbs>
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
          <div class="flex space-x-3 justify-end">
            <ButtonTable type="button" @click="createFolderModalOpen = true">
              Create Folder
            </ButtonTable>
            <ButtonTable type="button" @click="createFileModalOpen = true">
              Upload File
            </ButtonTable>
          </div>
        </template>
        <template #type="slotProps">
          <FolderIcon
            v-if="slotProps.dataItem.type === 'FOLDER'"
            class="w-5 h-5 text-gray-500"
          />
          <DocumentIcon
            v-if="slotProps.dataItem.type === 'FILE'"
            class="w-5 h-5 text-gray-500"
          />
        </template>
        <template #name="slotProps">
          <ButtonLink
            v-if="slotProps.dataItem.type === 'FOLDER'"
            :to="{
              name: 'files-dashboard',
              params: { id: slotProps.dataItem.id },
            }"
          >
            {{ slotProps.dataItem.name }}
          </ButtonLink>
          <div v-else class="">
            {{ slotProps.dataItem.name }}
          </div>
        </template>
        <template #last_edited="slotProps">
          {{ formatDate(slotProps.dataItem.last_edited) }}
        </template>
        <template #created="slotProps">
          {{ formatDate(slotProps.dataItem.created) }}
        </template>
        <template #action="slotProps">
          <div class="flex space-x-3 justify-end">
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FOLDER'"
              @click="
                folderOpen = slotProps.dataItem;
                updateFolderModalOpen = true;
              "
            >
              Change
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FOLDER'"
              @click="
                folderOpen = slotProps.dataItem;
                deleteFolderModalOpen = true;
              "
            >
              Delete
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FILE'"
              @click="downloadFile(slotProps.dataItem)"
            >
              Download
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FILE'"
              @click="
                fileOpen = slotProps.dataItem;
                updateFileModalOpen = true;
              "
            >
              Change
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FILE'"
              @click="
                fileOpen = slotProps.dataItem;
                deleteFileModalOpen = true;
              "
            >
              Delete
            </ButtonTable>
          </div>
        </template>
      </TableGenerator>
      <TableGenerator
        :head="[
          { name: 'Permission', key: 'type' },
          { name: 'Group', key: ['group_has_permission', 'name'] },
          { name: 'Source', key: 'folder' },
          { name: '', key: 'action' },
        ]"
        :data="folderPermissions"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable
              type="button"
              @click="createPermissionModalOpen = true"
            >
              Add Permission
            </ButtonTable>
          </div>
        </template>
        <template #folder="slotProps">
          <router-link
            :to="{
              name: 'files-dashboard',
              params: { id: slotProps.dataItem.folder.id },
            }"
            class="underline"
          >
            {{ slotProps.dataItem.folder.name }}
          </router-link>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonTable
              v-if="slotProps.dataItem.source === 'NORMAL'"
              type="button"
              @click="
                permissionOpen = slotProps.dataItem;
                deletePermissionModalOpen = true;
              "
            >
              Remove
            </ButtonTable>
          </div>
        </template>
      </TableGenerator>
      <BoxAlert type="warning">
        There seems to be a problem with the Safari Browser. At the moment we
        can only guarantee that the download works in Chrome or Firefox.
      </BoxAlert>
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
    <!-- breadcrumbs -->
    <ModalFree
      v-model="generalPermissionsModalOpen"
      width="max-w-screen-xl"
      title="General Permission"
    >
      <p class="mb-10 text-gray-600">
        Groups or users listed here have permissions that apply to the whole
        collab section. Those permissions can be managed within the admin
        section.
      </p>
      <TableGenerator
        :head="[
          { name: 'User', key: ['user_has_permission', 'name'] },
          { name: 'Group', key: ['group_has_permission', 'name'] },
          { name: 'Permission', key: ['permission', 'name'] },
        ]"
        :data="generalPermissions"
      ></TableGenerator>
    </ModalFree>
    <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
      <article class="prose">
        <p>Here is a short explanation of the different folder permissions.</p>
        <p>
          Once you click on a folder you can see its permissions in the
          permission table. Those permissions always relate to the folder that
          is open.
        </p>
        <p>There are 3 different kind of permissions.</p>
        <p>
          Let's start with the simple one first: 'read_folder'. With this
          permission the specified group can access the files of the folder and
          download them.
        </p>
        <p>
          The second one: 'write_folder' allows the specified group to upload
          and delete files within that folder.
        </p>
        <p>
          Both permissions 'read_folder' and 'write_folder' apply to all
          children of the source folder. A group that has the 'write_folder'
          permission for the top level folder can upload and delete files in
          every subfolder.
        </p>
        <p>
          The last permission 'see_folder' says that the specified group can see
          the folder name. But it can not see any files only the subfolder that
          leads to the source of the 'see_folder' permission.
        </p>
      </article>
    </ModalFree>
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
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import { onBeforeRouteUpdate, RouteLocation, useRoute } from "vue-router";
import CoreService from "@/services/core";
import { Group, HasPermission } from "@/types/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { FolderOpenIcon } from "@heroicons/vue/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/vue/solid";
import { formatDate } from "@/utils/date";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import BoxAlert from "@/components/BoxAlert.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import useCreateItem from "@/composables/useCreateItem";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useGetItems from "@/composables/useGetItems";
import { DjangoModel, JsonModel } from "@/types/shared";

export default defineComponent({
  components: {
    ButtonLink,
    BoxAlert,
    ButtonBreadcrumbs,
    FolderIcon,
    DocumentIcon,
    FolderOpenIcon, // eslint-disable-line vue/no-unused-components
    BreadcrumbsBar,
    ModalDelete,
    TableGenerator,
    ButtonTable,
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
    const generalPermissions = ref<HasPermission[] | null>(null);

    // general permissions
    useGetItems(FilesService.getGeneralPermissions, generalPermissions);

    // files and folders
    useGetItems(FilesService.getItems, items, folder);

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
      // general permissions
      generalPermissions,
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
  data() {
    return {
      helpModalOpen: false,
      generalPermissionsModalOpen: false,
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
