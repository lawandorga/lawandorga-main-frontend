<template>
  <BoxLoader :show="true">
    <div
      class="max-w-screen-2xl mx-auto space-y-6 2xl:grid 2xl:gap-6 2xl:grid-cols-3 2xl:space-y-0"
    >
      <!-- breadcrumbs -->
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
          <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
            Show General Permissions
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>

      <!-- documents left -->
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
        <CircleLoader v-if="!documents" />
        <ul v-else>
          <TreeItem
            v-for="item in documents.filter((item) => item.root)"
            :key="item.id"
            :item="item"
            :items="documents"
            @clicked="documentSelected($event)"
          />
        </ul>
      </div>

      <!-- single document -->
      <div
        class="bg-white shadow rounded-md p-5 2xl:col-span-2 print:p-0 print:shadow-none"
      >
        <div v-if="document">
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
            v-html="document.content"
          ></article>
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <Loader v-if="!document && documentLoading" />
        <p v-if="!document && !documentLoading">No document selected.</p>
        <BoxAlert
          v-show="document && document.content.includes('{')"
          type="warning"
          class="mt-2 print:hidden"
        >
          This might not look correct. Don't worry, as soon as you edit it and
          save it it will fix itself. This happens because we switched out the
          editor.
        </BoxAlert>
      </div>

      <!-- single document permissions -->
      <div v-if="document" class="2xl:col-span-2 print:hidden">
        <TableGenerator
          :head="[
            { name: 'Type', key: 'type' },
            { name: 'Group', key: ['group_has_permission', 'name'] },
            { name: 'Source', key: ['document', 'path'] },
            { name: '', key: 'action' },
          ]"
          :data="documentPermissions"
        >
          <template #head-action>
            <div class="flex justify-end">
              <ButtonNormal
                size="xs"
                color="lightblue"
                @click="createPermissionModalOpen = true"
              >
                Add
              </ButtonNormal>
            </div>
          </template>
          <template #action="slotProps">
            <div class="flex justify-end">
              <ButtonNormal
                v-if="slotProps.dataItem.source === 'NORMAL'"
                size="xs"
                color="lightred"
                @click="
                  permission = slotProps.dataItem;
                  deletePermissionModalOpen = true;
                "
              >
                Remove
              </ButtonNormal>
            </div>
          </template>
        </TableGenerator>
      </div>
    </div>

    <!-- general permissions -->
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
        :data="permissions"
      ></TableGenerator>
    </ModalFree>
    <!-- help -->
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
    <!-- versions modal -->
    <ModalFree v-model="versionsOpen" title="Versions">
      <ul class="space-y-2">
        <li v-for="item in versions" :key="item.id">
          <button
            type="button"
            class="w-full border-2 border-gray-300 rounded px-3 py-2 font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200"
            @click="versionSelected(item.id)"
          >
            {{ formatDate(item.updated) }}
          </button>
        </li>
      </ul>
      <Loader v-show="versionsLoading" />
    </ModalFree>
    <!-- create document -->
    <ModalFree v-model="createDocumentModalOpen" title="Create Document">
      <FormGenerator
        :fields="[
          { label: 'Path', name: 'path', disabled: true, required: true },
          { label: 'Name', name: 'name', required: true },
        ]"
        :initial="{ path: document ? document.path + '/' : '/' }"
        submit="Create"
        :request="createDocumentRequest"
        @success="documentCreated($event)"
      />
    </ModalFree>
    <!-- delete document -->
    <ModalDelete
      v-model="deleteDocumentModalOpen"
      :request="deleteDocumentRequest"
      :object="document"
      @deleted="documentDeleted($event)"
    />
    <!-- create permission -->
    <ModalFree v-model="createPermissionModalOpen" title="Add Permission">
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
        :request="createPermissionRequest"
      />
    </ModalFree>
    <!-- delete permission -->
    <ModalDelete
      v-model="deletePermissionModalOpen"
      :request="deletePermissionRequest"
      :object="permission"
    />
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
import CollabService from "@/services/collab";
import { formatDate } from "@/utils/date";
import { Group, HasPermission } from "@/types/core";
import TableGenerator from "@/components/TableGenerator.vue";
import CoreService from "@/services/core";
import { DocumentTextIcon } from "@heroicons/vue/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";
import { ref } from "vue";
import useGetItems from "@/composables/useGetItems";
import useCreateItem from "@/composables/useCreateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import CircleLoader from "@/components/CircleLoader.vue";

export default defineComponent({
  components: {
    CircleLoader,
    ButtonNormal,
    ButtonBreadcrumbs,
    BreadcrumbsBar,
    DocumentTextIcon,
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
  setup() {
    // all documents
    const documents = ref<CollabDocument[] | null>(null);
    useGetItems(CollabService.getDocuments, documents);

    // create document
    const {
      createRequest: createDocumentRequest,
      createModalOpen: createDocumentModalOpen,
    } = useCreateItem(CollabService.createDocument, documents);
    const documentCreated = (document: CollabDocument) => {
      if (documents.value === null) return;
      const parent = documents.value.find((item) => {
        let path = document.path.split("/");
        path.pop();
        return item.path === path.join("/");
      });
      if (parent !== undefined && parent.children)
        parent.children.push(document.id);
      documents.value.push(document);
    };

    // delete document
    const {
      deleteRequest: deleteDocumentRequest,
      deleteModalOpen: deleteDocumentModalOpen,
    } = useDeleteItem(CollabService.deleteDocument, documents);

    // single document
    const document = ref<CollabDocument | null>(null);
    const documentLoading = ref(false);
    const documentPermissions = ref<CollabDocumentPermission[] | null>(null);

    const documentSelected = (id: number) => {
      document.value = null;
      documentLoading.value = true;
      documentPermissions.value = null;
      CollabService.getLatestVersion(id).then((doc) => (document.value = doc));
      CollabService.getDocumentPermissions(id).then(
        (permissions) => (documentPermissions.value = permissions),
      );
    };

    // create and delete permission
    const permission = ref<CollabDocumentPermission | null>(null);

    // create permission
    const {
      createRequest: createPermissionRequest,
      createModalOpen: createPermissionModalOpen,
    } = useCreateItem(
      CollabService.createDocumentPermission,
      documentPermissions,
    );

    // delete permission
    const {
      deleteRequest: deletePermissionRequest,
      deleteModalOpen: deletePermissionModalOpen,
    } = useDeleteItem(
      CollabService.deleteDocumentPermission,
      documentPermissions,
    );

    return {
      // all documents
      documents,
      // create document
      createDocumentRequest,
      createDocumentModalOpen,
      documentCreated,
      // delete document
      deleteDocumentRequest,
      deleteDocumentModalOpen,
      // single document
      document,
      documentLoading,
      documentPermissions,
      documentSelected,
      // create and delete permission
      permission,
      // create permission
      createPermissionRequest,
      createPermissionModalOpen,
      // delete permission
      deletePermissionRequest,
      deletePermissionModalOpen,
    };
  },
  data: function () {
    return {
      versionLoading: false,
      versions: [] as CollabVersion[],
      versionsOpen: false,
      versionsLoading: false,
      formatDate: formatDate,
      permissions: [] as HasPermission[],
      permissionDeleteLoading: false,
      permissionOptions: [] as CollabPermission[],
      groups: [] as Group[],
      generalPermissionsModalOpen: false,
      helpModalOpen: false,
    };
  },
  mounted() {
    CollabService.getGeneralPermissions().then(
      (permissions) => (this.permissions = permissions),
    );
    CollabService.getCollabPermissions().then(
      (permissions) => (this.permissionOptions = permissions),
    );
    CoreService.getGroups().then((groups) => (this.groups = groups));
  },
  methods: {
    versionSelected(id: number) {
      this.versionLoading = true;
      this.version = null;
      const found = this.versions.find((item) => item.id === id);
      if (found) this.version = found;
      this.versionLoading = false;
    },
    menuClicked(id: string) {
      if (id === "delete") this.deleteOpen = true;
      if (id === "versions") {
        this.versionsLoading = true;
        this.versions = [];
        this.versionsOpen = true;
        CollabService.getVersions(this.version.id)
          .then((versions) => (this.versions = versions))
          .finally(() => (this.versionsLoading = false));
      }
    },
    print() {
      window.print();
    },
  },
});
</script>
