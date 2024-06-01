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

<script lang="ts">
import { defineComponent } from "vue";
import MenuItem from "./FormMenuItem.vue";
import { BooleanFunction, VoidFunction } from "@/types_deprecated/shared";

export default defineComponent({
  components: {
    MenuItem,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      items: [
        {
          icon: "bold",
          title: "Bold",
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive("bold"),
        },
        {
          icon: "italic",
          title: "Italic",
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive("italic"),
        },
        {
          icon: "strikethrough",
          title: "Strike",
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive("strike"),
        },
        {
          icon: "mark-pen-line",
          title: "Highlight Yellow",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleHighlight({ color: "#ffff99" })
              .run(),
          isActive: () =>
            this.editor.isActive("highlight", { color: "#ffff99" }),
          class: "border-yellow-200",
        },
        {
          icon: "mark-pen-line",
          title: "Highlight Red",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleHighlight({ color: "#fecddf" })
              .run(),
          isActive: () =>
            this.editor.isActive("highlight", {
              color: "#fecddf",
            }),
          class: "border-red-200",
        },
        {
          icon: "mark-pen-line",
          title: "Highlight Blue",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleHighlight({ color: "#b3e8ff" })
              .run(),
          isActive: () =>
            this.editor.isActive("highlight", {
              color: "#b3e8ff",
            }),
          class: "border-blue-200",
        },
        {
          icon: "mark-pen-line",
          title: "Highlight Green",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleHighlight({ color: "#b3ffbe" })
              .run(),
          isActive: () =>
            this.editor.isActive("highlight", {
              color: "#b3ffbe",
            }),
          class: "border-green-200",
        },
        {
          icon: "format-clear",
          title: "Clear Format",
          action: () =>
            this.editor.chain().focus().clearNodes().unsetAllMarks().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "h-2",
          title: "Heading 2",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive("heading", { level: 2 }),
        },
        {
          icon: "h-3",
          title: "Heading 3",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => this.editor.isActive("heading", { level: 3 }),
        },
        {
          icon: "paragraph",
          title: "Paragraph",
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive("paragraph"),
        },
        {
          type: "divider",
        },
        {
          icon: "list-unordered",
          title: "Bullet List",
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive("bulletList"),
        },
        {
          icon: "list-ordered",
          title: "Ordered List",
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive("orderedList"),
        },
        {
          icon: "double-quotes-l",
          title: "Blockquote",
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive("blockquote"),
        },
        {
          icon: "separator",
          title: "Horizontal Rule",
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "arrow-go-back-line",
          title: "Undo",
          action: () => this.editor.chain().focus().undo().run(),
        },
        {
          icon: "arrow-go-forward-line",
          title: "Redo",
          action: () => this.editor.chain().focus().redo().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "table-2",
          title: "Insert Table",
          action: () =>
            this.editor.commands.insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            }),
        },
        {
          icon: "insert-column-left",
          title: "Add Column Before",
          action: () => this.editor.chain().focus().addColumnBefore().run(),
        },
        {
          icon: "insert-column-right",
          title: "Add Column After",
          action: () => this.editor.chain().focus().addColumnAfter().run(),
        },
        {
          icon: "delete-column",
          title: "Delete Column",
          action: () => this.editor.chain().focus().deleteColumn().run(),
        },
        {
          icon: "insert-row-top",
          title: "Add Row Before",
          action: () => this.editor.chain().focus().addRowBefore().run(),
        },
        {
          icon: "insert-row-bottom",
          title: "Add Row After",
          action: () => this.editor.chain().focus().addRowAfter().run(),
        },
        {
          icon: "delete-row",
          title: "Delete Row",
          action: () => this.editor.chain().focus().deleteRow().run(),
        },
        {
          icon: "merge-cells-horizontal",
          title: "Merge Cell",
          action: () => this.editor.chain().focus().mergeCells().run(),
        },
        {
          icon: "split-cells-horizontal",
          title: "Split Cell",
          action: () => this.editor.chain().focus().splitCell().run(),
        },
        {
          icon: "heading",
          title: "Toggle Header Cell",
          action: () => this.editor.chain().focus().toggleHeaderCell().run(),
        },
        {
          icon: "omega",
          title: "Delete Table",
          action: () => this.editor.chain().focus().deleteTable().run(),
        },
      ] as {
        type?: "divider";
        icon: string;
        title: string;
        action: VoidFunction;
        isActive?: BooleanFunction;
      }[],
    };
  },
});
</script>
