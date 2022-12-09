<template>
  <label class="block" :for="id">
    <FormLabel :required="required" :label="label" />
    <div v-if="editor" class="break-words border border-gray-300 rounded-md">
      <MenuBarSimple
        class="sticky top-[-26px] z-10 flex items-center p-2 border-b border-gray-300 print:hidden"
        :editor="editor"
      />
      <div class="p-4 px-8">
        <EditorContent :editor="editor" />
      </div>
    </div>
    <FormHelptext :helptext="helptext" />
  </label>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { StarterKit } from "@tiptap/starter-kit";
import MenuBarSimple from "@/components/FormMenuBarSimple.vue";
import { Link } from "@tiptap/extension-link";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { FormHelptext, FormLabel } from "@lawandorga/components";

const props = defineProps({
  label: {
    required: true,
    type: String,
  },
  helptext: {
    required: false,
    default: "",
    type: String,
  },
  modelValue: {
    required: false,
    default: "",
    type: String,
  },
  name: {
    required: false,
    type: String,
    default: "",
  },
  required: {
    required: false,
    default: false,
    type: Boolean,
  },
});
const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      autolink: true,
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
