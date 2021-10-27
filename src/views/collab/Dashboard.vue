<template>
  <BoxLoader :show="!!documents.length">
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white shadow rounded p-5">
        <div class="flex justify-between items-baseline mb-4">
          <h2 class="text-lg font-bold">Documents</h2>
          <ButtonIcon type="button" icon="PlusCircle">Create</ButtonIcon>
        </div>
        <ul>
          <TreeItem
            v-for="item in documents"
            :key="item.pk"
            :item="item"
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
                :to="{ name: 'collab-detail', params: { id: document.pk } }"
              >
                Edit
              </ButtonIcon>
              <ButtonMenu
                :items="[
                  { name: 'Versions', id: 'versions' },
                  { name: 'Permissions', id: 'permissions' },
                  { name: 'Delete', id: 'delete' },
                ]"
              >
                test
              </ButtonMenu>
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

export default defineComponent({
  components: {
    Loader,
    BoxAlert,
    TreeItem,
    BoxLoader,
    ButtonIcon,
    ButtonMenu,
  },
  data: function () {
    return {
      documents: [] as CollabDocument[],
      text: null as CollabText | null,
      textLoading: false,
    };
  },
  computed: {
    document(): CollabDocument | null {
      const document = this.documents.find(
        (item: CollabDocument) => item.pk === this.text?.document,
      );
      if (document) return document;
      return null;
    },
  },
  mounted() {
    this.$axios
      .get<CollabDocument[]>("/collab/collab_documents/")
      .then((response) => (this.documents = response.data));
  },
  methods: {
    documentSelected(pk: number) {
      this.textLoading = true;
      this.text = null;
      this.$axios
        .get<CollabText>(`collab/collab_documents/${pk}/latest/`)
        .then((response) => (this.text = response.data))
        .finally(() => (this.textLoading = false));
    },
  },
});

// <router-link :to="{ name: 'collab-detail', params: { id: item.pk } }">
//             {{ item.path }}
//           </router-link>
</script>
