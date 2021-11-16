<template>
  <div class="hidden">
    <QuillEditor ref="quill" @ready="setUpQuill()" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";

export default defineComponent({
  components: {
    QuillEditor,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  emits: ["html"],
  methods: {
    setUpQuill() {
      (this.$refs.quill as typeof QuillEditor).setContents(
        JSON.parse(this.content),
      );
      const html = (this.$refs.quill as typeof QuillEditor).getHTML();
      this.$emit("html", html);
    },
  },
});
</script>
