<template>
  <BoxLoader :show="true">
    <div class="grid gap-6 max-w-screen-xl mx-auto">
      <BreadcrumbsBar
        v-if="text"
        :base="{ name: 'collab-dashboard' }"
        :pages="[
          {
            name: 'Document',
            to: { name: 'collab-detail', params: { id: text.id } },
          },
        ]"
      >
        <DocumentTextIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div
        class="bg-white shadow rounded px-6 py-5 print:shadow-none print:p-0"
      >
        <div v-if="loadQuill && !!text">
          <FormQuill :content="text.content" @html="content = $event" />
        </div>
        <div v-if="content === '' || (content && !!text)">
          <FormGenerator
            :fields="[
              {
                label: 'Content',
                name: 'content',
                type: 'tiptap',
                room: `Room ${text.id}`,
              },
            ]"
            :initial="initial"
            submit=""
            @change="change($event)"
          />
        </div>
        <div>
          <span
            :class="{
              'text-green-600': currentVersionSaved,
              'text-red-600': !currentVersionSaved,
            }"
          >
            {{ currentVersionSaved ? "Saved" : "Not saved..." }}
          </span>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CollabDocument } from "@/types/collab";
import FormQuill from "@/components/FormQuill.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import CollabService from "@/services/collab";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { DocumentTextIcon } from "@heroicons/vue/outline";
import { JsonModel } from "@/types/shared";

export default defineComponent({
  components: {
    BoxLoader,
    BreadcrumbsBar,
    DocumentTextIcon,
    FormGenerator,
    FormQuill,
  },
  data: function () {
    return {
      text: null as CollabDocument | null,
      content: null as string | null,
      loadQuill: false,
      currentVersionSaved: true,
      data: {} as JsonModel,
      saveInterval: null as ReturnType<typeof setInterval> | null,
    };
  },
  computed: {
    initial(): { document: string; content: string } {
      if (this.content !== null)
        return {
          document: this.$route.params.id as string,
          content: this.content,
        };
      return { document: this.$route.params.id as string, content: "" };
    },
  },
  created() {
    this.saveInterval = setInterval(this.saveIfRequired, 5000);
    CollabService.getLatestVersion(
      parseInt(this.$route.params.id as string),
    ).then((doc) => {
      this.text = doc;
      if (this.text.quill) this.loadQuill = true;
      else this.content = this.text.content as string;
    });
  },
  unmounted() {
    if (this.saveInterval !== null) clearInterval(this.saveInterval);
  },
  methods: {
    change(data: JsonModel) {
      if (this.content !== data["content"]) this.currentVersionSaved = false;
      this.data = Object.assign({}, data);
    },
    saveIfRequired() {
      if (!this.currentVersionSaved) this.save();
    },
    save() {
      this.currentVersionSaved = true;
      CollabService.createVersion(this.data);
    },
  },
});
</script>

@change="change($event)"
