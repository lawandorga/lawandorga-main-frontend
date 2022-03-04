<template>
  <BoxLoader :show="!!doc">
    <div class="grid gap-6 max-w-screen-xl mx-auto">
      <BreadcrumbsBar
        v-if="doc"
        :base="{ name: 'collab-dashboard' }"
        :pages="[
          {
            name: 'Document',
            to: { name: 'collab-detail', params: { id: doc.id } },
          },
        ]"
      >
        <DocumentTextIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div
        class="bg-white shadow rounded px-6 py-5 print:shadow-none print:p-0"
      >
        <FormTiptap v-model="model" :room="`Room ${doc.id}`">
          <div class="border-b-2 border-gray-800 flex justify-between">
            <div class="w-full">
              <input
                v-model="doc.name"
                type="doc"
                class="border-none bg-transparent px-3 py-2 text-3xl font-bold focus:border-none focus:outline-none focus:ring-offset-transparent focus:shadow-none shadow-none"
                @update:model-value="currentVersionSaved = false"
              />
            </div>
            <div class="flex items-center justify-center pr-3">
              <CircleLoader v-show="!currentVersionSaved" />
              <CheckIcon v-show="currentVersionSaved" class="w-6 h-6" />
            </div>
          </div>
        </FormTiptap>
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CollabDocument } from "@/types/collab";
import CollabService from "@/services/collab";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { DocumentTextIcon } from "@heroicons/vue/outline";
import FormTiptap from "@/components/FormTiptap.vue";
import { CheckIcon } from "@heroicons/vue/outline";
import CircleLoader from "@/components/CircleLoader.vue";

export default defineComponent({
  components: {
    CheckIcon,
    CircleLoader,
    FormTiptap,
    BoxLoader,
    BreadcrumbsBar,
    DocumentTextIcon,
  },
  data: function () {
    return {
      doc: null as CollabDocument | null,
      content: null as string | null,
      currentVersionSaved: true,
      saveInterval: null as ReturnType<typeof setInterval> | null,
    };
  },
  computed: {
    model: {
      get(): string | null {
        return this.content;
      },
      set(newValue: string) {
        this.content = newValue;
        this.change(newValue);
      },
    },
  },
  created() {
    // set auto save interval
    this.saveInterval = setInterval(this.saveIfRequired, 5000);
    // get the latest version
    CollabService.getLatestVersion(this.$route.params.id as string).then(
      (doc) => {
        this.doc = doc;
        this.content = doc.content_html;
      },
    );
  },
  unmounted() {
    if (this.saveInterval !== null) clearInterval(this.saveInterval);
  },
  methods: {
    change(newText: string) {
      if (this.doc === null) return;
      if (this.doc.content_html !== newText) this.currentVersionSaved = false;
    },
    saveIfRequired() {
      if (!this.currentVersionSaved) this.save();
    },
    save() {
      const data = Object.assign({}, this.doc, { content: this.content });
      this.currentVersionSaved = true;
      CollabService.createVersion(data).then((cb) => (this.doc = cb));
    },
  },
});
</script>

@change="change($event)"
