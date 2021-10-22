<template>
  <EditorContent :editor="editor" />
</template>

<script lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    EditorContent,
  },

  setup() {
    const editor = useEditor({
      content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
      extensions: [StarterKit],
    });

    return { editor };
  },
});
</script>
