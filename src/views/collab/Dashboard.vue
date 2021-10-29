<template>
  <BoxLoader :show="!!documents.length">
    <div class="grid grid-cols-3 gap-6">
      <div class="space-y-6">
        <div class="bg-white shadow rounded p-5">
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
        <div class="bg-white shadow rounded p-5">
          <div class="flex justify-between items-baseline mb-4">
            <h2 class="version-lg font-bold">Permissions</h2>
          </div>
          <div>
            <p v-show="!versionLoading && !version">No document selected.</p>
          </div>
        </div>
      </div>
      <div class="bg-white shadow rounded p-5 col-span-2">
        <div v-if="version && document">
          <div class="flex justify-between">
            <div>{{ document.path }}</div>
            <div class="flex space-x-3">
              <ButtonIcon
                icon="Pencil"
                :to="{ name: 'collab-detail', params: { id: document.id } }"
              >
                Edit
              </ButtonIcon>
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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article class="pt-8 prose" v-html="version.content"></article>
        </div>
        <Loader v-show="versionLoading" />
        <p v-show="!versionLoading && !version">No document selected.</p>
        <BoxAlert
          v-show="version && version.content.includes('{')"
          type="warning"
          class="mt-2"
        >
          This might not look correct. Don't worry, as soon as you edit it and
          save it it will fix itself. This happens because we switched out the
          editor.
        </BoxAlert>
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
        :url="`collab/collab_documents/${document.id}/`"
        :object="document.name"
        @deleted="documentDeleted(document.id)"
      />
    </div>
    <ModalFree v-model="versionsOpen" title="Versions">
      <ul class="space-y-2">
        <li v-for="item in versions" :key="item.id">
          <button
            type="button"
            class="
              w-full
              border-2 border-gray-300
              rounded
              px-3
              py-2
              font-medium
              text-left text-gray-700
              bg-gray-100
              hover:bg-gray-200
            "
            @click="versionSelected(item.id)"
          >
            {{ formatDate(item.created) }}
          </button>
        </li>
      </ul>
      <Loader v-show="versionsLoading" />
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabDocument, CollabVersion } from "@/types/collab";
import TreeItem from "@/components/TreeItem.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import Loader from "@/components/Loader.vue";
import BoxAlert from "@/components/BoxAlert.vue";
import ButtonIcon from "@/components/ButtonIcon.vue";
import ButtonMenu from "@/components/ButtonMenu.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Collab from "@/services/collab";
import { removeFromArray } from "@/utils/array";
import { formatDate } from "@/utils/date";

export default defineComponent({
  components: {
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
      formatDate: formatDate,
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
  },
  methods: {
    documentSelected(id: number) {
      this.versionLoading = true;
      this.version = null;
      Collab.getLatestVersion(id)
        .then((version) => (this.version = version))
        .finally(() => (this.versionLoading = false));
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
  },
});
</script>
