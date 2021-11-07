<template>
  <BoxLoader :show="true">
    <div class="grid lg:grid-cols-2 gap-10">
      <div
        v-if="folder && folder.path.length"
        class="bg-white rounded m-0 lg:col-span-2 px-3 py-2"
      >
        <div class="flex items-center">
          <div
            v-for="(item, index) in folder.path"
            :key="item.id"
            class="flex items-center"
          >
            <router-link
              :to="{ name: 'files-dashboard', params: { id: item.id } }"
              class="underline"
            >
              {{ item.name }}
            </router-link>
            <div v-if="index !== folder.path.length - 1" class="mx-4">/</div>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <TableGenerator
          :head="[
            { name: 'Type', key: 'type' },
            { name: 'Name', key: 'name' },
            { name: 'Updated', key: 'last_edited' },
            { name: 'Created', key: 'created' },
            { name: '', key: 'action' },
          ]"
          :data="items"
        >
          <template #head-action>
            <ButtonTable type="button" @click="openFolderCreate()">
              Create Folder
            </ButtonTable>
            <ButtonTable type="button" @click="openFileCreate()">
              Upload File
            </ButtonTable>
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
          <template #action="slotProps">
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FOLDER'"
              type="button"
              @click="openFolderUpdate(slotProps.dataItem)"
            >
              Update Folder
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FOLDER'"
              type="button"
              @click="openFolderDelete(slotProps.dataItem)"
            >
              Delete Folder
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FILE'"
              type="button"
              @click="openFileDelete(slotProps.dataItem)"
            >
              Delete File
            </ButtonTable>
            <ButtonTable
              v-if="slotProps.dataItem.type === 'FILE'"
              type="button"
              @click="downloadFile(slotProps.dataItem)"
            >
              Download File
            </ButtonTable>
          </template>
        </TableGenerator>
      </div>

      <div class="col-span-2">
        <TableGenerator
          :head="[
            { name: 'Permission', key: 'permission' },
            { name: 'Group', key: 'group_has_permission' },
            { name: 'Source', key: 'source' },
            { name: '', key: 'action' },
          ]"
          :data="permissions"
        >
          <template #head-action>
            <ButtonTable type="button" @click="openPermissionCreate()">
              Add Permission
            </ButtonTable>
          </template>
          <template #action="slotProps">
            <ButtonTable
              type="button"
              @click="openPermissionDelete(slotProps.dataItem)"
            >
              Delete Permission
            </ButtonTable>
          </template>
        </TableGenerator>
      </div>

      <!-- <mat-card class="m-0 p-0 lg:col-span-2">
      <table mat-table [dataSource]="permissions" class="w-full">
        <ng-container mat-column-def="type">
          <th mat-header-cell *matHeaderCellDef>Permission</th>
          <td mat-cell *matCellDef="let permission">{{ permission.type }}</td>
        </ng-container>
        <ng-container mat-column-def="group">
          <th mat-header-cell *matHeaderCellDef>Group</th>
          <td mat-cell *matCellDef="let permission">
            {{ permission.group_has_permission.name }}
          </td>
        </ng-container>
        <ng-container mat-column-def="source">
          <th mat-header-cell *matHeaderCellDef>Source</th>
          <td mat-cell *matCellDef="let permission">
            {{ permission.folder.name }}
          </td>
        </ng-container>
        <ng-container mat-column-def="actions">
          <th mat-header-cell *matHeaderCellDef style="text-align: right">
            <button mat-button (click)="onAddPermission()" color="primary">
              Add Permission
            </button>
          </th>
          <td mat-cell *matCellDef="let permission" style="text-align: right">
            <button
              *ngIf="permission.source === 'NORMAL'"
              mat-button
              (click)="onRemovePermission(permission.id)"
              color="warn"
            >
              Remove
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="permissionColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: permissionColumns;"></tr>
      </table>
    </mat-card> -->
    </div>
    <!-- folder -->
    <ModalFree v-model="folderCreateOpen" title="Create Folder">
      <FormGenerator
        :fields="folderFields"
        :request="createFolder"
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
  </BoxLoader>
</template>

<script lang="ts">
import {
  FilesFolder,
  FilesFile,
  FilesPermission,
  FilesPossiblePermission,
} from "@/types/files";
import { defineComponent } from "@vue/runtime-core";
import FilesService from "@/services/files";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import { RouteLocation } from "vue-router";
import CoreService from "@/services/core";
import { Group } from "@/types/core";

export default defineComponent({
  components: {
    ModalDelete,
    TableGenerator,
    ButtonTable,
    BoxLoader,
    ModalFree,
    FormGenerator,
  },
  beforeRouteUpdate(to) {
    this.getFolder(to);
  },
  data() {
    return {
      // shown
      items: [] as (FilesFolder | FilesFile)[],
      folder: null as FilesFolder | null,
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
    };
  },
  watch: {
    folder(newValue) {
      FilesService.getPermissions(newValue).then(
        (permissions) => (this.permissions = permissions),
      );
      FilesService.getItems(newValue).then((items) => (this.items = items));
    },
  },
  mounted() {
    this.getFolder(this.$route);
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
      FilesService.getItems(folder).then((items) => (this.items = items));
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
      this.items = this.items.filter((item) => item.id !== folder.id);
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
      this.items = this.items.filter((item) => item.id !== file.id);
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
