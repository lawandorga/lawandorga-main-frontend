<template>
  <div>
    <QuillEditor ref="editor" @ready="setUpQuill()" theme="snow" />
  <div v-if="editor" class="editor">
    <MenuBar class="editor__header" :editor="editor" />
    <EditorContent ref="tiptap" class="editor__content" :editor="editor" />
    <div class="editor__footer">
      <div :class="`editor__status editor__status--${status}`">
        <template v-if="status === 'connected'">
          {{ users.length }} user{{ users.length === 1 ? "" : "s" }} online in
          {{ room }}
        </template>
        <template v-else>offline</template>
      </div>
      <div class="editor__name">
        {{ user.name }}
      </div>
    </div>
  </div>
  <button type="button" @click="reformat()">reformat text</button>
  </div>
</template>

<script lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const getRandomElement = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

export default defineComponent({
  components: {
    QuillEditor,
    EditorContent,
    MenuBar,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      provider: null as null | WebrtcProvider,
      editor: null,
      users: [],
      status: "connecting",
      room: 'Room 1',
      html: ""
    };
  },

  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
    editorUser() {
      return {
        name: this.user.name,
        color: this.getRandomColor()
      }
    }
  },

  mounted() {
    const ydoc = new Y.Doc();

    this.provider = new WebrtcProvider('Room 1', ydoc, 
    // {
    //   password: "1234",
    //   signaling: ["wss://y-webrtc-signaling-eu.herokuapp.com/"],
    // }
    );

    this.provider.on("status", (event) => {
      console.log(event);

      this.status = event.status;
    });

    window.ydoc = ydoc;

    this.editor = new Editor({
      content: this.html,
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
          onUpdate: (users) => {
            this.users = users;
          },
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    });
  },

  beforeUnmount() {
    this.editor.destroy();
    this.provider.destroy();
  },

  methods: {
    setUpQuill() {
      this.$refs.editor.setContents(JSON.parse(this.content))
    },

    reformat() {
      console.log(this.$refs.editor.getHTML())
      this.editor.commands.setContent(this.$refs.editor.getHTML());
    },

    updateCurrentUser(attributes) {
      this.currentUser = { ...this.currentUser, ...attributes };
      this.editor.chain().focus().user(this.currentUser).run();

      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    },

    getRandomColor() {
      return getRandomElement([
        "#958DF1",
        "#F98181",
        "#FBBC88",
        "#FAF594",
        "#70CFF8",
        "#94FADB",
        "#B9F18D",
      ]);
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
