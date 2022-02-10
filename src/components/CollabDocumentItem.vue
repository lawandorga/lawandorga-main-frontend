<template>
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
            kind="action"
            :to="{ name: 'collab-detail', params: { id: document.id } }"
          >
            Edit
          </ButtonNormal>
          <ButtonNormal kind="action" @click="print()">Print</ButtonNormal>
          <ButtonNormal kind="action" @click="versionsModalOpen = true">
            Versions
          </ButtonNormal>
          <ButtonNormal kind="delete" @click="$emit('delete', document)">
            Delete
          </ButtonNormal>
        </div>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <article class="pt-8 prose print:p-0" v-html="document.content"></article>
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <CircleLoader v-if="documentId && !document" />
    <p v-if="!documentId">No document selected.</p>
    <BoxAlert
      v-show="document && document.quill"
      type="warning"
      class="mt-2 print:hidden"
    >
      This might not look correct. Don't worry, as soon as you edit it and save
      it it will fix itself. This happens because we switched out the editor.
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
            kind="action"
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
            kind="delete"
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

  <!-- versions modal -->
  <ModalFree v-model="versionsModalOpen" title="Versions">
    <CircleLoader v-if="!versions" />
    <ul v-else class="space-y-2">
      <li v-for="item in versions" :key="item.id">
        <button
          type="button"
          class="w-full border-2 border-gray-300 rounded px-3 py-2 font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200"
          @click="versionSelected(item)"
        >
          {{ formatDate(item.updated) }}
        </button>
      </li>
    </ul>
  </ModalFree>

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
          options: groupOptions,
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
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import {
  CollabDocument,
  CollabDocumentPermission,
  CollabPermission,
  CollabVersion,
} from "@/types/collab";
import BoxAlert from "@/components/BoxAlert.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import CollabService from "@/services/collab";
import { formatDate } from "@/utils/date";
import { Group } from "@/types/core";
import TableGenerator from "@/components/TableGenerator.vue";
import CoreService from "@/services/core";
import ButtonNormal from "@/components/ButtonNormal.vue";
import { ref, watch } from "vue";
import useCreateItem from "@/composables/useCreateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import CircleLoader from "@/components/CircleLoader.vue";

export default defineComponent({
  components: {
    CircleLoader,
    ButtonNormal,
    TableGenerator,
    BoxAlert,
    ModalFree,
    FormGenerator,
    ModalDelete,
  },
  props: {
    documentId: {
      type: Number,
      default: null,
    },
  },
  emits: ["delete", "found"],
  setup(props, { emit }) {
    const { documentId } = toRefs(props);

    // single document
    const document = ref<CollabDocument | null>(null);

    const documentPermissions = ref<CollabDocumentPermission[] | null>(null);

    watch(documentId, (newValue) => {
      document.value = null;
      documentPermissions.value = null;
      if (newValue === null) return;
      CollabService.getLatestVersion(newValue).then((doc) => {
        document.value = doc;
        emit("found", doc);
      });
      CollabService.getDocumentPermissions(newValue).then(
        (permissions) => (documentPermissions.value = permissions),
      );
    });

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

    // versions
    const versions = ref<CollabVersion[] | null>(null);
    const versionsModalOpen = ref(false);

    watch(versionsModalOpen, (newValue) => {
      if (document.value === null || newValue === false) return;
      versions.value = null;
      CollabService.getVersions(document.value.id).then(
        (v) => (versions.value = v),
      );
    });

    const versionSelected = (version: CollabVersion) => {
      if (document.value === null) return;
      document.value.content = version.content;
    };

    return {
      // single document
      document,
      documentPermissions,
      // create and delete permission
      permission,
      // create permission
      createPermissionRequest,
      createPermissionModalOpen,
      // delete permission
      deletePermissionRequest,
      deletePermissionModalOpen,
      // versions
      versions,
      versionsModalOpen,
      versionSelected,
      // utils
      formatDate,
    };
  },
  data: function () {
    return {
      permissionOptions: [] as CollabPermission[],
      groupOptions: [] as Group[],
    };
  },
  created() {
    CollabService.getCollabPermissions().then(
      (permissions) => (this.permissionOptions = permissions),
    );
    CoreService.getGroups().then((groups) => (this.groupOptions = groups));
  },
  methods: {
    print() {
      window.print();
    },
  },
});
</script>
