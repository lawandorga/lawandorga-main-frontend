<template>
  <component
    :is="is"
    class="
      inline-flex
      items-center
      px-2
      py-0.5
      -mx-2
      border border-transparent
      text-sm
      font-medium
      rounded
      text-blue-800
      hover:text-blue-900 hover:bg-blue-50
      focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-lorgablue
    "
    :class="[
      disabledComputed
        ? 'pointer-events-none opacity-40 cursor-not-allowed'
        : '',
    ]"
    :to="to"
    :href="href"
    :disabled="disabledComputed"
    :type="type"
    @click="emitClick()"
  >
    <Loader v-show="loading" color="text-white" class="mr-2" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Loader from "./CircleLoader.vue";

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
    disabledComputed() {
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

<style></style>
