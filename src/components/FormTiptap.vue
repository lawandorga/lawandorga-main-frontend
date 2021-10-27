<template>
  <div v-if="editor" class="border-2 border-gray-800 rounded-xl">
    <MenuBar
      class="flex items-center border-b-2 border-gray-800 p-2"
      :editor="editor"
    />
    <EditorContent ref="tiptap" :editor="editor" />
    <div
      class="
        text-gray-800
        flex
        items-center
        justify-between
        border-t-2 border-gray-800
        px-2
        py-1
      "
    >
      <div class="space-x-4">
        <span v-for="item in users" :key="item.clientId" class="text-sm">
          {{ item.name }}
        </span>
      </div>
      <div class="text-sm">{{ editor.getCharacterCount() }} characters</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Editor, EditorContent, EditorEvents } from "@tiptap/vue-3";
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
import { WebrtcProvider } from "y-webrtc";
import MenuBar from "./MenuBar.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    EditorContent,
    MenuBar,
  },
  props: {
    room: {
      type: String,
      default: "Room 1",
    },
    modelValue: {
      type: [String, Boolean, Number],
      default: "",
      required: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      provider: null as null | WebrtcProvider,
      editor: null as null | Editor,
      users: [] as { [key: string]: any; clientId: number }[], // eslint-disable-line @typescript-eslint/no-explicit-any
      setup: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    editorUser() {
      return {
        name: this.user.name,
        color: this.getRandomColor(),
      };
    },
  },
  watch: {
    modelValue: function (newValue, oldValue) {
      if (
        newValue.length > 0 &&
        oldValue.length > 0 &&
        newValue.length % oldValue.length === 0 &&
        newValue.length !== oldValue.length
      ) {
        this.editor?.commands.setContent(oldValue);
      } else if (newValue !== oldValue && !this.setup) {
        this.editor?.commands.setContent(newValue);
        this.setup = true;
      }
    },
  },
  mounted() {
    const ydoc = new Y.Doc();

    this.provider = new WebrtcProvider(
      this.room,
      ydoc,
      // {
      //   password: "1234",
      //   signaling: ["wss://y-webrtc-signaling-eu.herokuapp.com/"],
      // }
    );

    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: "prose p-5 w-full focus:outline-none sm:max-w-none",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: this.editorUser,
          onUpdate: (users): null => {
            this.users = users;
            return null;
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

    this.editor.on("update", (props: EditorEvents["update"]) => {
      const html = props.editor.getHTML();
      this.$emit("update:modelValue", html);
    });
  },
  beforeUnmount() {
    this.editor ? this.editor.destroy() : null;
    this.provider ? this.provider.destroy() : null;
  },
  methods: {
    getRandomColor() {
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
    },
  },
});
</script>

<style>
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
</style>