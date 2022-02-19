<template>
  <div>
    <component
      :is="is"
      :class="[baseClasses, kindColorClasses, kindSizeClasses, moreClasses]"
      v-bind="attrs"
      @click="emitClick()"
    >
      <Loader v-show="loading" color="text-white" class="mr-2" />
      <slot />
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Loader from "./CircleLoader.vue";

export default defineComponent({
  components: {
    Loader,
  },
  props: {
    to: {
      type: [String, Object],
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "button",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    kind: {
      type: String as PropType<
        "primary" | "secondary" | "action" | "delete" | "link"
      >,
      default: "primary",
    },
  },
  emits: ["click"],
  computed: {
    attrs() {
      let attrs = {} as { [key: string]: any };  // eslint-disable-line
      if (this.type && this.is === "button") {
        attrs["type"] = this.type;
        attrs["disabled"] = this.disabledComputed;
      } else if (this.is === "router-link") {
        attrs["to"] = this.to;
      } else if (this.is === "a") {
        attrs["href"] = this.href;
      }
      return attrs;
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
    disabledComputed() {
      if (this.loading || this.disabled) return true;
      return false;
    },
    baseClasses() {
      return "cursor-pointer inline-flex items-center focus:outline-none";
    },
    kindColorClasses() {
      if (this.kind === "primary") {
        return "border shadow-sm border-transparent text-white bg-lorgablue bg-opacity-100 hover:bg-opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-lorgablue";
      } else if (this.kind === "secondary") {
        return "border shadow-sm border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-2 focus:ring-offset-2";
      } else if (this.kind === "action") {
        return "border border-transparent text-blue-700 hover:text-blue-900 hover:bg-blue-50 focus:border-blue-200";
      } else if (this.kind === "delete") {
        return "border border-transparent text-red-600 hover:text-red-700 hover:bg-red-50 focus:border-red-200";
      } else if (this.kind === "link") {
        return "underline text-lorgablue hover:text-opacity-75 focus:ring-0";
      }
      return "";
    },
    kindSizeClasses() {
      if (this.kind === "action" || this.kind === "delete") {
        return "px-2 py-0.5 text-sm font-medium rounded-md -mx-2 -my-0.5 hover:z-10 hover:relative";
      } else if (this.kind === "link") {
        return "";
      } else if (this.kind === "primary" || this.kind === "secondary") {
        return "px-4 py-2 text-sm font-medium rounded-xl";
      }
      return "";
    },
    moreClasses() {
      let moreClasses = "";

      if (this.disabledComputed)
        moreClasses += "pointer-events-none opacity-80 cursor-not-allowed";

      return moreClasses;
    },
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
});
</script>
