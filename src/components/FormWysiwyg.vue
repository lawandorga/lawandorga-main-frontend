<script setup lang="ts">
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { FormHelptext, FormLabel } from "lorga-ui";
import { computed, onMounted, ref, toRefs, watch } from "vue";

import MenuBarSimple from "@/components/FormMenuBarSimple.vue";
import { useAvailableFolders } from "@/features/folders/api/useAvailableFolders";
import FolderMention from "@/features/folders/extensions/FolderMention";
import createFolderMentionSuggestion from "@/features/folders/extensions/folderMentionSuggestion";

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
const { name, modelValue } = toRefs(props);

const id = computed(() => `form-wysiwyg-${name.value}`);

const emit = defineEmits(["update:modelValue"]);

const { folders, loadFolders } = useAvailableFolders();

const folderMentionHint =
  "Hint: To link a folder, type # followed by the beginning of the folder name and pick the folder from the list of suggestions.";

const editor = useEditor({
  editorProps: {
    attributes: {
      class:
        "prose prose-p:mt-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-p:mb-0 p-5 pt-2.5 pb-4 w-full focus:outline-none sm:max-w-none",
    },
  },
  extensions: [
    StarterKit,
    Link.configure({
      autolink: true,
      HTMLAttributes: { class: "underline text-formcolor" },
    }),
    FolderMention.configure({
      suggestion: createFolderMentionSuggestion({
        folders: () => folders.value,
        loadFolders,
      }),
    }),
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value ? editor.value.getHTML() : "");
  },
});

const setEditorContent = (value: string) => {
  if (!value && value !== "") return;
  if (!editor.value) return;
  editor.value.commands.setContent(value, {
    errorOnInvalidContent: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
  });
  isSet.value = true;
};

onMounted(() => setEditorContent(modelValue.value));

const isSet = ref(false);
watch(modelValue, (newValue) => {
  if (!isSet.value) setEditorContent(newValue);
});
</script>

<template>
  <label class="block" :for="id">
    <FormLabel :required="required" :label="label" />
  </label>
  <div v-if="editor" class="rounded-md border border-gray-300 break-words">
    <MenuBarSimple
      class="sticky top-[-26px] z-10 flex items-center border-b border-gray-300 p-2 print:hidden"
      :editor="editor"
    />
    <EditorContent :editor="editor" />
  </div>
  <FormHelptext :helptext="helptext" />
  <FormHelptext :helptext="folderMentionHint" />
</template>
