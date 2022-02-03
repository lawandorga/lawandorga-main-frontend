<template>
  <BoxLoader :show="true">
    <div
      class="max-w-screen-2xl mx-auto space-y-6 2xl:grid 2xl:gap-6 2xl:grid-cols-3 2xl:space-y-0"
    >
      <BreadcrumbsBar
        class="2xl:col-span-3"
        :base="{ name: 'collab-dashboard' }"
        :pages="[]"
      >
        <DocumentTextIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonBreadcrumbs @click="helpModalOpen = true">
            Show Help
          </ButtonBreadcrumbs>
          <ButtonBreadcrumbs @click="eneralPermissionsModalOpen = true">
            Show General Permissions
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>

      <div class="bg-white shadow rounded-md p-5 2xl:row-span-2 print:hidden">
        <div class="flex justify-between items-baseline mb-4">
          <h2 class="version-lg font-bold">Documents</h2>
          <ButtonIcon
            type="button"
            icon="PlusCircle"
            @click="createOpen = true"
          >
            Create
          </ButtonIcon>
        </div>
        <ul>
          <TreeItem
            v-for="item in documents.filter((item) => item.root)"
            :key="item.id"
            :item="item"
            :items="documents"
            @clicked="documentSelected($event)"
          />
        </ul>
      </div>

      <div
        class="bg-white shadow rounded-md p-5 2xl:col-span-2 print:p-0 print:shadow-none"
      >
        <div v-if="version && document">
          <div
            class="flex flex-col justify-between lg:flex-row lg:items-center print:hidden"
          >
            <div class="text-sm text-gray-500 mb-2">{{ document.path }}</div>
            <div class="flex space-x-3 self-end">
              <ButtonNormal
                size="sm"
                color="blue"
                :to="{ name: 'collab-detail', params: { id: document.id } }"
              >
                Edit
              </ButtonNormal>
              <ButtonNormal size="sm" color="blue" @click="print()">
                Print
              </ButtonNormal>
              <ButtonMenu
                :items="[
                  { name: 'Versions', id: 'versions' },
                  { name: 'Permissions', id: 'permissions' },
                  { name: 'Delete', id: 'delete' },
                ]"
                @click="menuClicked($event)"
              />
            </div>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <article
            class="pt-8 prose print:p-0"
            v-html="version.content"
          ></article>
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <Loader v-show="versionLoading" />
        <p v-show="!versionLoading && !version">No document selected.</p>
        <BoxAlert
          v-show="version && version.content.includes('{')"
          type="warning"
          class="mt-2 print:hidden"
        >
          This might not look correct. Don't worry, as soon as you edit it and
          save it it will fix itself. This happens because we switched out the
          editor.
        </BoxAlert>
      </div>
      <div class="2xl:col-span-2 print:hidden">
        <TableGenerator
          :head="[
            { name: 'Type', key: 'type' },
            { name: 'Group', key: ['group_has_permission', 'name'] },
            { name: 'Source', key: ['document', 'path'] },
            { name: '', key: 'action' },
          ]"
          :data="docPermissions"
        >
          <template #head-action>
            <ButtonTable @click="addPermissionOpen = true">Add</ButtonTable>
          </template>
          <template #action="slotProps">
            <ButtonTable
              v-if="slotProps.dataItem.source === 'NORMAL'"
              type="button"
              :loading="permissionDeleteLoading"
              @click="deletePermission(slotProps.dataItem.id)"
            >
              Remove
            </ButtonTable>
          </template>
        </TableGenerator>
      </div>
    </div>
    <ModalFree v-model="createOpen" title="Create Document">
      <FormGenerator
        :fields="[
          { label: 'Path', name: 'path', disabled: true, required: true },
          { label: 'Name', name: 'name', required: true },
        ]"
        :initial="{ path: document ? document.path + '/' : '/' }"
        submit="Create"
        :request="createDocument"
        @success="documentCreated($event)"
      />
    </ModalFree>
    <div v-if="document">
      <ModalDelete
        v-model="deleteOpen"
        :request="deleteDocument"
        :object="document"
        @deleted="documentDeleted(document.id)"
      />
    </div>
    <ModalFree v-model="versionsOpen" title="Versions">
      <ul class="space-y-2">
        <li v-for="item in versions" :key="item.id">
          <button
            type="button"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200"
            @click="versionSelected(item.id)"
          >
            {{ formatDate(item.created) }}
          </button>
        </li>
      </ul>
      <Loader v-show="versionsLoading" />
    </ModalFree>
    <ModalFree v-model="addPermissionOpen" title="Add Permission">
      <FormGenerator
        :fields="[
          {
            label: 'Permission',
            name: 'permission',
            type: 'select',
            required: true,
            options: permissionOptions,
          },
          {
            label: 'Group',
            name: 'group_has_permission',
            type: 'select',
            required: true,
            options: groups,
          },
        ]"
        :initial="{ document: document.id }"
        :request="createPermission"
        @success="permissionCreated($event)"
      />
    </ModalFree>
    <ModalFree
      v-model="eneralPermissionsModalOpen"
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
        :data="permissions"
      ></TableGenerator>
    </ModalFree>
    <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
      <article class="prose">
        <p>
          Here is a short explanation of the different document permissions.
        </p>
        <p>
          Once you click on a Document you can see its permissions in the
          permission table. Those permissions always relate to the document that
          is opened or was clicked at.
        </p>
        <p>There are 3 different kind of permissions.</p>
        <p>
          Let's start with the simple one first: 'read_document'. With this
          permission the specified group can access the content of the document
          and read it.
        </p>
        <p>
          The second one: 'write_document' allows the specified group to read
          the content of the document and update it.
        </p>
        <p>
          Both permissions 'read_document' and 'write_document' apply to all
          children of the source document. A group that has the 'write_document'
          permission for the top level document can write and add documents
          everywhere within the tree.
        </p>
        <p>
          The last permission 'see_document' says that the specified group can
          see the document name within the tree structure. But it can not see
          its content. This permission appears when the group has access to a
          document further down the tree.
        </p>
      </article>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  CollabDocument,
  CollabDocumentPermission,
  CollabPermission,
  CollabVersion,
} from "@/types/collab";
import TreeItem from "@/components/TreeItem.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import Loader from "@/components/CircleLoader.vue";
import BoxAlert from "@/components/BoxAlert.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import ButtonMenu from "@/components/ButtonMenu.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Collab from "@/services/collab";
import { removeFromArray } from "@/utils/array";
import { formatDate } from "@/utils/date";
import { Group, HasPermission } from "@/types/core";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import Core from "@/services/core";
import { DocumentTextIcon } from "@heroicons/vue/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";

export default defineComponent({
  components: {
    ButtonNormal,
    ButtonBreadcrumbs,
    BreadcrumbsBar,
    DocumentTextIcon,
    ButtonTable,
    TableGenerator,
    Loader,
    BoxAlert,
    TreeItem,
    BoxLoader,
    ButtonIcon,
    ButtonMenu,
    ModalFree,
    FormGenerator,
    ModalDelete,
  },
  data: function () {
    return {
      documents: [] as CollabDocument[],
      version: null as CollabVersion | null,
      versionLoading: false,
      versions: [] as CollabVersion[],
      versionsOpen: false,
      versionsLoading: false,
      createOpen: false,
      deleteOpen: false,
      createDocument: Collab.createDocument,
      deleteDocument: Collab.deleteDocument,
      formatDate: formatDate,
      permissions: [] as HasPermission[],
      docPermissions: [] as CollabDocumentPermission[],
      permissionDeleteLoading: false,
      addPermissionOpen: false,
      permissionOptions: [] as CollabPermission[],
      createPermission: Collab.createDocumentPermission,
      groups: [] as Group[],
      eneralPermissionsModalOpen: false,
      helpModalOpen: false,
    };
  },
  computed: {
    document(): CollabDocument | null {
      const document = this.documents.find(
        (item: CollabDocument) => item.id === this.version?.document,
      );
      if (document) return document;
      return null;
    },
  },
  mounted() {
    Collab.getDocuments().then((documents) => (this.documents = documents));
    Collab.getGeneralPermissions().then(
      (permissions) => (this.permissions = permissions),
    );
    Collab.getCollabPermissions().then(
      (permissions) => (this.permissionOptions = permissions),
    );
    Core.getGroups().then((groups) => (this.groups = groups));
  },
  methods: {
    documentSelected(id: number) {
      this.versionLoading = true;
      this.version = null;
      Collab.getLatestVersion(id)
        .then((version) => (this.version = version))
        .finally(() => (this.versionLoading = false));
      Collab.getDocumentPermissions(id).then(
        (permissions) => (this.docPermissions = permissions),
      );
    },
    versionSelected(id: number) {
      this.versionLoading = true;
      this.version = null;
      const found = this.versions.find((item) => item.id === id);
      if (found) this.version = found;
      this.versionLoading = false;
    },
    documentCreated(data: CollabDocument) {
      this.createOpen = false;
      this.documents
        .find((item) => {
          let path = data.path.split("/");
          path.pop();
          return item.path === path.join("/");
        })
        ?.children.push(data.id);
      this.documents.push(data);
    },
    documentDeleted(id: number) {
      this.deleteOpen = false;
      this.documents = removeFromArray(this.documents, id) as CollabDocument[];
    },
    menuClicked(id: string) {
      if (id === "delete") this.deleteOpen = true;
      if (id === "versions") {
        this.versionsLoading = true;
        this.versions = [];
        this.versionsOpen = true;
        Collab.getVersions(this.document ? this.document.id : 0)
          .then((versions) => (this.versions = versions))
          .finally(() => (this.versionsLoading = false));
      }
    },
    deletePermission(id: number) {
      this.permissionDeleteLoading = true;
      Collab.deleteDocumentPermission(id)
        .then(
          () =>
            (this.docPermissions = this.docPermissions.filter(
              (item) => item.id !== id,
            )),
        )
        .finally(() => (this.permissionDeleteLoading = false));
    },
    permissionCreated(data: CollabDocumentPermission) {
      this.addPermissionOpen = false;
      this.docPermissions.push(data);
    },
    print() {
      window.print();
    },
  },
});
</script>
