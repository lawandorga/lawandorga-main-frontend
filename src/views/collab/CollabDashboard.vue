<template>
  <BoxLoader :show="true">
    <div
      class="mx-auto space-y-6 max-w-screen-2xl 2xl:grid 2xl:gap-6 2xl:grid-cols-3 2xl:space-y-0"
    >
      <!-- breadcrumbs -->
      <BreadcrumbsBar
        class="2xl:col-span-3"
        :base="{ name: 'collab-dashboard' }"
        :pages="[]"
      >
        <DocumentTextIcon class="w-6 h-6" />
        <template #buttons>
          <CollabHelp />
          <CollabPermissions />
        </template>
      </BreadcrumbsBar>

      <!-- documents left -->
      <div class="p-5 bg-white rounded-md shadow 2xl:row-span-2 print:hidden">
        <div class="flex items-baseline justify-between mb-4">
          <h2 class="font-bold version-lg">Documents</h2>
        </div>
        <CircleLoader v-if="!documents" />
        <ul v-else>
          <TreeItem
            v-for="item in documents.filter((item) => item.root)"
            :key="item.id"
            :item="item"
            :items="documents"
            @clicked="documentId = $event"
          />
        </ul>
      </div>

      <!-- single document -->
      <CollabDocumentItem
        :document-id="documentId"
        @delete="
          document = $event;
          deleteDocumentModalOpen = true;
        "
        @found="document = $event"
      />
    </div>

    <!-- create document -->
    <ModalForm
      v-model="createDocumentModalOpen"
      title="Create Document"
      :fields="[
        { label: 'Path', name: 'path', disabled: true, required: true },
        { label: 'Name', name: 'name', required: true },
      ]"
      :data="{ path: document ? document.path + '/' : '/' }"
      submit="Create"
      :request="createDocumentRequest"
      @success="documentCreated($event)"
    />

    <!-- delete document -->
    <ModalDelete
      v-model="deleteDocumentModalOpen"
      :request="deleteDocumentRequest"
      :data="document"
      @deleted="documentDeleted()"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { CollabDocument } from "@/types/collab";
import TreeItem from "@/components/TreeItem.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { ModalDelete, ButtonNormal, CircleLoader, ModalForm } from "lorga-ui";
import CollabService from "@/services/collab";
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet from "@/composables/useGet";
import useCreate from "@/composables/useCreate";
import useDelete from "@/composables/useDelete";
import CollabDocumentItem from "@/components/CollabDocumentItem.vue";
import CollabHelp from "@/components/CollabHelp.vue";
import CollabPermissions from "@/components/CollabPermissions.vue";

export default defineComponent({
  components: {
    ModalForm,
    CollabPermissions,
    CollabHelp,
    CollabDocumentItem,
    CircleLoader,
    ButtonNormal,
    BreadcrumbsBar,
    DocumentTextIcon,
    TreeItem,
    BoxLoader,
    ModalDelete,
  },
  setup() {
    // all documents
    const documents = ref<CollabDocument[] | null>(null);
    useGet(CollabService.getDocuments, documents);

    // create document
    const {
      createRequest: createDocumentRequest,
      createModalOpen: createDocumentModalOpen,
    } = useCreate(CollabService.createDocument, documents);

    const documentCreated = (document: CollabDocument) => {
      if (documents.value === null) return;
      const parent = documents.value.find((item) => {
        const path = document.path.split("/");
        path.pop();
        return item.path === path.join("/");
      });
      if (parent !== undefined && parent.children)
        parent.children.push(document.id);
    };

    // single document
    const documentId = ref<null | number>(null);
    const document = ref<CollabDocument | null>(null);

    // delete document
    const {
      deleteRequest: deleteDocumentRequest,
      deleteModalOpen: deleteDocumentModalOpen,
    } = useDelete(CollabService.deleteDocument, documents);

    const documentDeleted = () => {
      documentId.value = null;
      document.value = null;
    };

    return {
      // all documents
      documents,
      // create document
      createDocumentRequest,
      createDocumentModalOpen,
      documentCreated,
      // delete document
      document,
      documentDeleted,
      deleteDocumentRequest,
      deleteDocumentModalOpen,
      // single document
      documentId,
    };
  },
});
</script>
