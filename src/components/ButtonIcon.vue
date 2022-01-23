<template>
  <component
    :is="is"
    :to="to"
    :href="href"
    :type="type"
    class="rounded-lg group no-underline pl-2 pr-3 py-0.5 flex items-center font-normal transition bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1"
    @click="emitClick()"
  >
    <component
      :is="iconComponent"
      class="text-gray-500 group-hover:text-gray-600 mr-1.5 w-5 h-5"
    />
    <span><slot /></span>
  </component>
</template>

<script lang="ts">
import {
  DocumentDownloadIcon,
  PencilIcon,
  XCircleIcon,
  TrashIcon,
  ArrowSmRightIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  PlusCircleIcon,
  ArrowDownIcon,
} from "@heroicons/vue/solid";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ArrowDownIcon,
    DocumentDownloadIcon,
    PencilIcon,
    PlusCircleIcon,
    XCircleIcon,
    ArrowSmRightIcon,
    TrashIcon,
    ArrowSmUpIcon,
    ArrowSmDownIcon,
  },
  props: {
    icon: {
      type: String,
      default: "DocumentDownload",
    },
    to: {
      type: [String, Object],
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  emits: ["click"],
  computed: {
    iconComponent() {
      if (this.icon === "Pencil") return PencilIcon;
      else if (this.icon === "XCircle") return XCircleIcon;
      else if (this.icon === "Trash") return TrashIcon;
      else if (this.icon === "PlusCircle") return PlusCircleIcon;
      else if (this.icon === "ArrowDown") return ArrowDownIcon;
      else if (this.icon === "ArrowSmRight") return ArrowSmRightIcon;
      else if (this.icon === "ArrowSmUp") return ArrowSmUpIcon;
      else if (this.icon === "ArrowSmDown") return ArrowSmDownIcon;
      return DocumentDownloadIcon;
    },
    is() {
      if (this.to) {
        return "router-link";
      } else if (this.href) {
        return "a";
      } else if (this.type) {
        return "button";
      }
      return "div";
    },
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
});
</script>
