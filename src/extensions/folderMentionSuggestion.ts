import { VueRenderer } from "@tiptap/vue-3";
import { SuggestionOptions } from "@tiptap/suggestion";

import FolderMentionList from "@/components/FolderMentionList.vue";
import { Folder } from "@/features/folders/api/useFolderPage";

const MAX_RESULTS = 10;

export default function createFolderMentionSuggestion(
  getFolderList: () => Folder[],
): Omit<SuggestionOptions, "editor"> {
  return {
    char: "#",
    items: ({ query }) => {
      const q = query.toLowerCase();
      return getFolderList()
        .filter((folder) => folder.name.toLowerCase().includes(q))
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
