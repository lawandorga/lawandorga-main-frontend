<template>
  <div v-if="editor" class="break-words border border-gray-300 rounded-md">
    <MenuBarSimple
      class="sticky top-[-26px] z-10 flex items-center p-2 border-b border-gray-300 print:hidden"
      :editor="editor"
    />
    <div class="p-4 px-8">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { StarterKit } from "@tiptap/starter-kit";
import MenuBarSimple from "@/components/FormMenuBarSimple.vue";
import Highlight from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      autolink: false,
      HTMLAttributes: { class: "underline text-lorgablue" },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: "list-disc",
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: "list-decimal",
      },
    }),
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value ? editor.value.getHTML() : "");
  },
});
</script>
