<template>
  <component
    :is="is"
    class="
      inline-flex
      items-center
      px-4
      py-2
      border border-transparent
      text-sm
      font-medium
      rounded-xl
      shadow-sm
      text-indigo-700
      bg-indigo-100
      hover:bg-indigo-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    "
    :class="[disabledComputed ? 'pointer-events-none opacity-80' : '']"
    :to="to"
    :href="href"
    :disabled="disabledComputed"
    :type="type"
    @click="emitClick()"
  >
    <Loader v-show="loading" color="text-indigo-600" class="mr-2" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Loader from "./Loader.vue";

export default defineComponent({
  components: {
    Loader,
  },
  props: {
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
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  computed: {
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
    disabledComputed(): boolean {
      if (this.loading) return true;
      return this.disabled;
    },
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
});
</script>
