<template>
  <component
    :is="is"
    :class="[
      baseClasses,
      colorDependingClasses,
      sizeDependingClasses,
      moreClasses,
    ]"
    v-bind="attrs"
    @click="emitClick()"
  >
    <Loader v-show="loading" color="text-white" class="mr-2" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
    size: {
      type: String,
      default: "lg",
    },
    color: {
      type: String,
      default: "blue",
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
      return "cursor-pointer inline-flex items-center shadow-sm border focus:outline-none focus:ring-2 focus:ring-offset-2";
    },
    colorDependingClasses() {
      if (this.color === "blue")
        return "border-transparent text-white bg-lorgablue bg-opacity-100 hover:bg-opacity-90 focus:ring-lorgablue";
      else if (this.color === "indigo")
        return "border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200";
      return "";
    },
    sizeDependingClasses() {
      if (this.size === "sm")
        return "px-2.5 py-1.5 text-xs font-medium rounded-md";
      else if (this.size === "md")
        return "px-3 py-2 text-sm font-medium rounded-xl";
      else if (this.size === "lg")
        return "px-4 py-2 text-sm font-medium rounded-xl";
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
