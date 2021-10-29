<template>
  <BoxLoader :show="!!documents.length">
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white shadow rounded p-5">
        <div class="flex justify-between items-baseline mb-4">
          <h2 class="text-lg font-bold">Documents</h2>
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
      <div class="bg-white shadow rounded p-5 col-span-2">
        <div v-if="text && document">
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
          <article class="pt-8 prose" v-html="text.content"></article>
        </div>
        <Loader v-show="textLoading" />
        <p v-show="!textLoading && !text">No document selected.</p>
        <BoxAlert
          v-show="text && text.content.includes('{')"
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
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabDocument, CollabText } from "@/types/collab";
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
      text: null as CollabText | null,
      textLoading: false,
      createOpen: false,
      deleteOpen: false,
      createDocument: Collab.createDocument,
    };
  },
  computed: {
    document(): CollabDocument | null {
      const document = this.documents.find(
        (item: CollabDocument) => item.id === this.text?.document,
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
      this.textLoading = true;
      this.text = null;
      Collab.getLatestText(id)
        .then((text) => (this.text = text))
        .finally(() => (this.textLoading = false));
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
    },
  },
});
</script>
