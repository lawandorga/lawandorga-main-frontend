<template>
  <div v-if="editor" class="break-words border-2 border-gray-800 rounded-xl">
    <slot></slot>
    <MenuBar
      class="sticky top-[-26px] bg-white z-10 flex items-center p-2 border-gray-800 print:hidden"
      :class="{
        'border-y-2': $slots.default,
        'border-b-2 rounded-t-xl': !$slots.default,
      }"
      :editor="editor"
    />

    <EditorContent ref="tiptap" :editor="editor" class="break-words" />
    <div
      class="flex items-center justify-between px-2 py-1 text-gray-800 border-t-2 border-gray-800 print:hidden"
    >
      <div class="space-x-4">
        <span
          v-for="item in editor.storage.collaborationCursor.users"
          :key="item.clientId"
          class="text-sm"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="text-sm">
        {{ editor.storage.characterCount.characters() }} characters
      </div>
    </div>
    {{ props.modelValue }}
  </div>
</template>

<script lang="ts" setup>
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import * as Y from "yjs";
import MenuBar from "./FormMenuBar.vue";
import { onMounted, onUnmounted, toRefs } from "vue";
import { useUserStore } from "@/store/user";
import { TiptapCollabProvider } from "@hocuspocus/provider";

const props = defineProps<{
  room: string;
  modelValue: string;
  password: string; // this password should change daily
}>();
const { room, modelValue } = toRefs(props);

const userStore = useUserStore();

const emit = defineEmits(["update:modelValue"]);

let provider: TiptapCollabProvider | undefined;

const doc = new Y.Doc();

onMounted(() => {
  provider = new TiptapCollabProvider({
    name: room.value, // any identifier - all connections sharing the same identifier will be synced
    appId: "7j9y6m10", // replace with YOUR_APP_ID
    token: "notoken", // replace with your JWT
    document: doc,
  });
});

onUnmounted(() => provider?.destroy());

const editor = useEditor({
  content: modelValue.value,
  editorProps: {
    attributes: {
      class: "prose p-5 w-full focus:outline-none sm:max-w-none",
    },
  },
  extensions: [
    StarterKit.configure({
      history: false,
    }),
    Highlight.configure({ multicolor: true }),
    Collaboration.configure({
      document: doc,
    }),
    CollaborationCursor.configure({
      provider: provider,
      user: {
        name: userStore.user?.name,
        color: getRandomColor(),
      },
    }),
    CharacterCount.configure({
      limit: 10000,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
});

setTimeout(() => {
  if (editor.value?.storage.collaborationCursor.users.length === 1)
    setEditorContent(modelValue.value);
  editor.value?.on("update", ({ editor: e }) => {
    editorUpdated(e.getHTML());
  });
}, 500);

function editorUpdated(value: string) {
  emit("update:modelValue", value);
}

function setEditorContent(value: string) {
  editor.value?.commands.setContent(value, false, {
    preserveWhitespace: true,
  });
}

function getRandomColor() {
  const colors = [
    "#958DF1",
    "#F98181",
    "#FBBC88",
    "#FAF594",
    "#70CFF8",
    "#94FADB",
    "#B9F18D",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
</script>

<style lang="css">
/* give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0d0d0d;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* make cell selection visible */
.selectedCell {
  @apply relative;
}
.selectedCell:after {
  z-index: 2;
  @apply absolute inset-0 bg-gray-600 bg-opacity-10 pointer-events-none;
  content: "";
}

/* break words within the editor */
.ProseMirror {
  word-break: break-all;
}
</style>
