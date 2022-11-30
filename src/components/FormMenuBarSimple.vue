<template>
  <div class="flex flex-wrap">
    <template v-for="(item, index) in items">
      <div
        v-if="item.type === 'divider'"
        :key="`divider${index}`"
        class="mx-3 divider"
      />
      <MenuItem v-else :key="index" v-bind="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { BooleanFunction, VoidFunction } from "@/types/shared";
import { ref } from "vue";
import MenuItem from "./FormMenuItem.vue";

const props = defineProps<{
  editor: Editor;
}>();

const items = ref([
  {
    icon: "bold",
    title: "Bold",
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive("bold"),
  },
  {
    icon: "italic",
    title: "Italic",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive("italic"),
  },
  {
    icon: "strikethrough",
    title: "Strike",
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive("strike"),
  },
  {
    icon: "format-clear",
    title: "Clear Format",
    action: () =>
      props.editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    type: "divider",
  },
  {
    icon: "list-unordered",
    title: "Bullet List",
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive("bulletList"),
  },
  {
    icon: "list-ordered",
    title: "Ordered List",
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive("orderedList"),
  },
  {
    icon: "link",
    title: "Link",
    action: () => {
      const isActive = props.editor.isActive("link");
      if (isActive) {
        props.editor.chain().focus().unsetLink().run();
      } else {
        const href = window.prompt("Enter the URL");
        if (href) {
          props.editor.chain().focus().setLink({ href }).run();
        }
      }
    },
    isActive: () => props.editor.isActive("link"),
  },
  {
    type: "divider",
  },
  {
    icon: "arrow-go-back-line",
    title: "Undo",
    action: () => props.editor.chain().focus().undo().run(),
  },
  {
    icon: "arrow-go-forward-line",
    title: "Redo",
    action: () => props.editor.chain().focus().redo().run(),
  },
] as {
  type?: "divider";
  icon: string;
  title: string;
  action: VoidFunction;
  isActive?: BooleanFunction;
}[]);
</script>

<style scoped></style>
