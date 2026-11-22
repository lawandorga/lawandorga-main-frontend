<script lang="ts" setup>
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount } from "@tiptap/extensions/character-count";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { toRefs } from "vue";

import MenuBar from "./FormMenuBar.vue";

const props = defineProps<{
  modelValue: string;
}>();
const { modelValue } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: modelValue.value,
  onUpdate: ({ editor: e }) => emit("update:modelValue", e.getHTML()),
  editorProps: {
    attributes: {
      class: "prose p-5 w-full focus:outline-none sm:max-w-none",
    },
  },
  extensions: [
    StarterKit.configure({
      undoRedo: false,
    }),
    Highlight.configure({ multicolor: true }),
    CharacterCount.configure({
      limit: 10000,
    }),
    TableKit.configure({
      table: {
        resizable: true,
      },
    }),
  ],
});
</script>

<template>
  <div v-if="editor" class="rounded-xl border-2 border-gray-800 break-words">
    <slot></slot>
    <MenuBar
      class="sticky top-[-26px] z-10 flex items-center border-gray-800 bg-white p-2 print:hidden"
      :class="{
        'border-y-2': $slots.default,
        'rounded-t-xl border-b-2': !$slots.default,
      }"
      :editor="editor"
    />

    <EditorContent ref="tiptap" :editor="editor" class="break-words" />
    <div
      class="flex items-center justify-between border-t-2 border-gray-800 px-2 py-1 text-gray-800 print:hidden"
    >
      <div class="space-x-4"></div>
      <div class="text-sm">
        {{ editor.storage.characterCount.characters() }} characters
      </div>
    </div>
  </div>
</template>

<style lang="css">
@reference "tailwindcss";

/* make cell selection visible */
.selectedCell {
  @apply relative;
}
.selectedCell:after {
  z-index: 2;
  @apply pointer-events-none absolute inset-0 bg-gray-600/10;
  content: "";
}

/* break words within the editor */
.ProseMirror {
  word-break: break-all;
}
</style>
