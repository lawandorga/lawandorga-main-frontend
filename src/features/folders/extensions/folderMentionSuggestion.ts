import { SuggestionOptions } from "@tiptap/suggestion";
import { VueRenderer } from "@tiptap/vue-3";

import FolderMentionList from "@/features/folders/components/FolderMentionList.vue";

import { AvailableFolder } from "../api/useAvailableFolders";

const MAX_RESULTS = 10;

interface FolderSource {
  folders: () => AvailableFolder[];
  loadFolders: () => Promise<void>;
}

export default function createFolderMentionSuggestion({
  folders,
  loadFolders,
}: FolderSource): Omit<SuggestionOptions, "editor"> {
  return {
    char: "#",
    items: async ({ query }) => {
      await loadFolders();
      const search = query.toLowerCase();
      return folders()
        .filter((folder) => folder.name.toLowerCase().includes(search))
        .slice(0, MAX_RESULTS);
    },
    render: () => {
      let component: VueRenderer;
      let unmount: (() => void) | undefined;

      return {
        onStart: (props) => {
          component = new VueRenderer(FolderMentionList, {
            props,
            editor: props.editor,
          });
          unmount = props.mount(component.element as HTMLElement);
        },
        onUpdate: (props) => {
          component.updateProps(props);
        },
        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            unmount?.();
            return true;
          }
          return component.ref?.onKeyDown(props) ?? false;
        },
        onExit: () => {
          unmount?.();
          component.destroy();
        },
      };
    },
  };
}
