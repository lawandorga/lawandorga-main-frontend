import { mergeAttributes } from "@tiptap/core";
import Mention from "@tiptap/extension-mention";

const FolderMention = Mention.extend({
  name: "folderMention",

  parseHTML() {
    return [{ tag: `a[data-type="${this.name}"]` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
        href: `/folders/${node.attrs.id}/`,
        class: "underline text-formcolor",
      }),
      `📁 ${node.attrs.label}`,
    ];
  },

  renderText({ node }) {
    return `#${node.attrs.label}`;
  },
});

export default FolderMention;
