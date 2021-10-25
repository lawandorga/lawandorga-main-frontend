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
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
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
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      provider: null as null | WebrtcProvider,
      editor: null as null | Editor,
      users: [] as { [key: string]: any; clientId: number }[], // eslint-disable-line @typescript-eslint/no-explicit-any
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
      content: this.modelValue,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm p-5 w-full focus:outline-none sm:max-w-none sm:prose",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
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
.editor {
  display: flex;
  flex-direction: column;
  max-height: 26rem;
  color: #0d0d0d;
  background-color: #fff;
  border: 3px solid #0d0d0d;
  border-radius: 0.75rem;
  /* Some information about the status */
}

.editor__header {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
  border-bottom: 3px solid #0d0d0d;
}

.editor__content {
  padding: 1.25rem 1rem;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.editor__footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  white-space: nowrap;
  border-top: 3px solid #0d0d0d;
  font-size: 12px;
  font-weight: 600;
  color: #0d0d0d;
  white-space: nowrap;
  padding: 0.25rem 0.75rem;
}

.editor__status {
  display: flex;
  align-items: center;
  border-radius: 5px;
}

.editor__status::before {
  content: " ";
  flex: 0 0 auto;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background: rgba(13, 13, 13, 0.5);
  border-radius: 50%;
  margin-right: 0.5rem;
}

.editor__status--connecting::before {
  background: #616161;
}

.editor__status--connected::before {
  background: #b9f18d;
}

.editor__name button {
  background: none;
  border: none;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #0d0d0d;
  border-radius: 0.4rem;
  padding: 0.25rem 0.5rem;
}

.editor__name button:hover {
  color: #fff;
  background-color: #0d0d0d;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
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

/* Basic editor styles */
.ProseMirror > * + * {
  margin-top: 0.75em;
}

.ProseMirror ul,
.ProseMirror ol {
  padding: 0 1rem;
}

.ProseMirror h1,
.ProseMirror h2,
.ProseMirror h3,
.ProseMirror h4,
.ProseMirror h5,
.ProseMirror h6 {
  line-height: 1.1;
}

.ProseMirror code {
  background-color: rgba(97, 97, 97, 0.1);
  color: #616161;
}

.ProseMirror pre {
  background: #0d0d0d;
  color: #fff;
  font-family: "JetBrainsMono", monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}

.ProseMirror mark {
  background-color: #faf594;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
}

.ProseMirror hr {
  margin: 1rem 0;
}

.ProseMirror blockquote {
  padding-left: 1rem;
  border-left: 2px solid rgba(13, 13, 13, 0.1);
}

.ProseMirror hr {
  border: none;
  border-top: 2px solid rgba(13, 13, 13, 0.1);
  margin: 2rem 0;
}

.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: center;
}

.ProseMirror ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.ProseMirror ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}
</style>
