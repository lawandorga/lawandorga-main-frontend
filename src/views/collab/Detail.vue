<template>
  <div class="bg-white shadow rounded px-6 py-5">
    <div v-if="loadQuill && !!text">
      <FormQuill :content="text.content" @html="content = $event" />
    </div>
    <div v-if="content === '' || (content && !!text)">
      <FormGenerator
        :fields="[{ label: 'Content', name: 'content', type: 'tiptap' }]"
        :request="createVersion"
        success="Saved"
        submit="Save"
        :initial="{ content: content, quill: false, document: text.document }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabVersion } from "@/types/collab";
import FormQuill from "@/components/FormQuill.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import Collab from "@/services/collab";

export default defineComponent({
  components: {
    FormGenerator,
    FormQuill,
  },
  data: function () {
    return {
      text: null as CollabVersion | null,
      content: null as string | null,
      loadQuill: false,
      createVersion: Collab.createVersion,
    };
  },
  mounted() {
    Collab.getLatestVersion(parseInt(this.$route.params.id as string)).then(
      (version) => {
        this.text = version;
        if (this.text.quill) this.loadQuill = true;
        else this.content = this.text.content;
      },
    );
  },
});
</script>
