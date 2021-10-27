<template>
  <div class="bg-white shadow rounded px-6 py-5">
    <div v-if="loadQuill && !!text">
      <FormQuill :content="text.content" @html="content = $event" />
    </div>
    <div v-if="content && !!text">
      <FormGenerator
        :fields="[{ label: 'Content', name: 'content', type: 'tiptap' }]"
        action="collab/createTextVersion"
        success="Saved"
        submit="Save"
        :initial="{ content: content, quill: false, document: text.document }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabText } from "@/types/collab";
import FormQuill from "@/components/FormQuill.vue";
import FormGenerator from "@/components/FormGenerator.vue";

export default defineComponent({
  components: {
    FormGenerator,
    FormQuill,
  },
  data: function () {
    return {
      text: null as CollabText | null,
      content: null as string | null,
      loadQuill: false,
    };
  },
  mounted() {
    this.$axios
      .get<CollabText>(
        `collab/collab_documents/${this.$route.params.id}/latest/`,
      )
      .then((response) => {
        this.text = response.data;
        if (this.text.quill) this.loadQuill = true;
        else this.content = this.text.content;
      });
  },
  methods: {
    updateDocument() {
      if (this.text) {
        const data = Object.assign({}, this.text, {
          content: this.content,
          quill: false,
        });
        this.$axios
          .post<CollabText>(
            `collab/text_documents/${this.text.document}/versions/`,
            data,
          )
          .then((response) => (this.text = response.data));
      }
    },
  },
});
</script>
