<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="!!folder"
        :base="base"
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
      <div>
        <TableGenerator
          :head="[
            { name: '', key: 'type' },
            { name: 'Name', key: 'name' },
            { name: 'Updated', key: 'last_edited' },
            { name: 'Created', key: 'created' },
            { name: '', key: 'action' },
          ]"
          :data="items"
          :loading="itemsLoading"
        >
          <template #head-action>
            <div class="flex space-x-3 justify-end">
              <ButtonTable type="button" @click="openFolderCreate()">
                Create Folder
              </ButtonTable>
              <ButtonTable type="button" @click="openFileCreate()">
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
            <router-link
              v-if="slotProps.dataItem.type === 'FOLDER'"
              class="underline"
              :to="{
                name: 'files-dashboard',
                params: { id: slotProps.dataItem.id },
              }"
            >
              {{ slotProps.dataItem.name }}
            </router-link>
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
                type="button"
                @click="openFolderUpdate(slotProps.dataItem)"
              >
                Change
              </ButtonTable>
              <ButtonTable
                v-if="slotProps.dataItem.type === 'FOLDER'"
                type="button"
                @click="openFolderDelete(slotProps.dataItem)"
              >
                Delete
              </ButtonTable>
              <ButtonTable
                v-if="slotProps.dataItem.type === 'FILE'"
                type="button"
                @click="downloadFile(slotProps.dataItem)"
              >
                Download
              </ButtonTable>
              <ButtonTable
                v-if="slotProps.dataItem.type === 'FILE'"
                type="button"
                @click="openFileDelete(slotProps.dataItem)"
              >
                Delete
              </ButtonTable>
            </div>
          </template>
        </TableGenerator>
      </div>
      <div>
        <TableGenerator
          :head="[
            { name: 'Permission', key: 'type' },
            { name: 'Group', key: ['group_has_permission', 'name'] },
            { name: 'Source', key: 'folder' },
            { name: '', key: 'action' },
          ]"
          :data="permissions"
          :loading="permissionsLoading"
        >
          <template #head-action>
            <div class="flex justify-end">
              <ButtonTable type="button" @click="openPermissionCreate()">
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
                @click="openPermissionDelete(slotProps.dataItem)"
              >
                Remove
              </ButtonTable>
            </div>
          </template>
        </TableGenerator>
      </div>
    </div>
    <!-- folder -->
    <ModalFree v-model="folderCreateOpen" title="Create Folder">
      <FormGenerator
        :fields="folderFields"
        :request="createFolder"
        :initial="{ parent: folder.id }"
        @success="folderCreated($event)"
      />
    </ModalFree>
    <ModalFree v-model="folderUpdateOpen" title="Update Folder">
      <FormGenerator
        :fields="folderFields"
        :initial="folderOpen"
        :request="updateFolder"
        @success="folderUpdated($event)"
      />
    </ModalFree>
    <ModalDelete
      v-model="folderDeleteOpen"
      :request="deleteFolder"
      :object="folderOpen"
      @deleted="folderDeleted($event)"
    />
    <!-- file -->
    <ModalFree v-model="fileCreateOpen" title="Create File">
      <FormGenerator
        :fields="fileFields"
        :request="createFile"
        :initial="{ folder: folder.id }"
        @success="fileCreated($event)"
      />
    </ModalFree>
    <ModalDelete
      v-model="fileDeleteOpen"
      :request="deleteFile"
      :object="fileOpen"
      @deleted="fileDeleted($event)"
    />
    <!-- permission -->
    <ModalFree v-model="permissionCreateOpen" title="Add Permission">
      <FormGenerator
        :fields="permissionFields"
        :request="createPermission"
        :initial="{ folder: folder.id }"
        @success="permissionCreated($event)"
      />
    </ModalFree>
    <ModalDelete
      v-model="permissionDeleteOpen"
      :request="deletePermission"
      :object="permission"
      @deleted="permissionDeleted($event)"
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
import { defineComponent } from "vue";
import FilesService from "@/services/files";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import { RouteLocation } from "vue-router";
import CoreService from "@/services/core";
import { Group, HasPermission } from "@/types/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { FolderOpenIcon } from "@heroicons/vue/outline";
import { FolderIcon, DocumentIcon } from "@heroicons/vue/solid";
import { formatDate } from "@/utils/date";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";

export default defineComponent({
  components: {
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
  beforeRouteUpdate(to) {
    this.itemsLoading = true;
    this.items = [];
    this.permissionsLoading = true;
    this.permissions = [];
    this.getFolder(to);
  },
  data() {
    return {
      // utils
      formatDate: formatDate,
      // breadcrumbs
      base: { name: "files-dashboard" },
      // shown
      itemsLoading: true,
      items: [] as (FilesFolder | FilesFile)[],
      folder: null as FilesFolder | null,
      permissionsLoading: true,
      permissions: [] as FilesPermission[],
      // folder
      createFolder: FilesService.createFolder,
      updateFolder: FilesService.updateFolder,
      deleteFolder: FilesService.deleteFolder,
      folderFields: [
        {
          label: "Name",
          type: "text",
          name: "name",
          required: true,
        },
      ],
      folderOpen: null as null | FilesFolder,
      folderCreateOpen: false,
      folderUpdateOpen: false,
      folderDeleteOpen: false,
      // file
      createFile: FilesService.createFile,
      deleteFile: FilesService.deleteFile,
      fileFields: [
        {
          label: "File",
          type: "file",
          name: "file",
          required: true,
        },
      ],
      fileOpen: null as null | FilesFile,
      fileCreateOpen: false,
      fileDeleteOpen: false,
      // permission
      createPermission: FilesService.createPermission,
      deletePermission: FilesService.deletePermission,
      permission: null as null | FilesPermission,
      permissionCreateOpen: false,
      permissionDeleteOpen: false,
      permissionFields: [
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
          required: true,
        },
      ],
      // breadcrumbs
      generalPermissions: [] as HasPermission[],
      helpModalOpen: false,
      generalPermissionsModalOpen: false,
    };
  },
  watch: {
    folder(newValue) {
      FilesService.getPermissions(newValue)
        .then((permissions) => (this.permissions = permissions))
        .finally(() => (this.permissionsLoading = false));
      FilesService.getItems(newValue)
        .then((items) => (this.items = items))
        .finally(() => (this.itemsLoading = false));
    },
  },
  mounted() {
    this.getFolder(this.$route);
    FilesService.getGeneralPermissions().then(
      (permissions) => (this.generalPermissions = permissions),
    );
  },
  methods: {
    getFolder(route: RouteLocation) {
      if (route.params.id)
        FilesService.getFolder(route.params.id as string).then(
          (folder) => (this.folder = folder),
        );
      else
        FilesService.getFirstFolder().then((folder) => (this.folder = folder));
    },
    getItems(folder: FilesFolder) {
      FilesService.getItems(folder)
        .then((items) => (this.items = items))
        .finally(() => (this.itemsLoading = false));
    },
    // folder create
    openFolderCreate() {
      this.folderCreateOpen = true;
    },
    folderCreated(folder: FilesFolder) {
      this.folderCreateOpen = false;
      this.items.push(folder);
    },
    // folder update
    openFolderUpdate(folder: FilesFolder) {
      this.folderOpen = folder;
      this.folderUpdateOpen = true;
    },
    folderUpdated(folder: FilesFolder) {
      this.folderUpdateOpen = false;
      let index = this.items.findIndex((item) => item.id === folder.id);
      if (index !== -1) this.items.splice(index, 1, folder);
    },
    // folder delete
    openFolderDelete(folder: FilesFolder) {
      this.folderOpen = folder;
      this.folderDeleteOpen = true;
    },
    folderDeleted(folder: FilesFolder) {
      this.folderDeleteOpen = false;
      this.items = this.items.filter(
        (item) => item.id !== folder.id || item.type === "FILE",
      );
    },
    // file create
    openFileCreate() {
      this.fileCreateOpen = true;
    },
    fileCreated(file: FilesFile) {
      this.fileCreateOpen = false;
      this.items.push(file);
    },
    // file delete
    openFileDelete(file: FilesFile) {
      this.fileOpen = file;
      this.fileDeleteOpen = true;
    },
    fileDeleted(file: FilesFile) {
      this.fileDeleteOpen = false;
      this.items = this.items.filter(
        (item) => item.id !== file.id || item.type === "FOLDER",
      );
    },
    // file download
    downloadFile(file: FilesFile) {
      FilesService.downloadFile(file);
    },
    // permission create
    openPermissionCreate() {
      FilesService.getPossiblePermissions().then(
        (possiblePermissions) =>
          (this.permissionFields[0].options = possiblePermissions),
      );
      CoreService.getGroups().then(
        (groups) => (this.permissionFields[1].options = groups),
      );
      this.permissionCreateOpen = true;
    },
    permissionCreated(permission: FilesPermission) {
      this.permissionCreateOpen = false;
      this.permissions.push(permission);
    },
    // permission delete
    openPermissionDelete(permission: FilesPermission) {
      this.permission = permission;
      this.permissionDeleteOpen = true;
    },
    permissionDeleted(permission: FilesPermission) {
      this.permissionDeleteOpen = false;
      this.permissions = this.permissions.filter(
        (item) => item.id !== permission.id,
      );
    },
  },
});
</script>
