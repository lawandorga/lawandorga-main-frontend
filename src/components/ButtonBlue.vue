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
      text-white
      hover:text-white
      bg-blue-800
      hover:bg-blue-900
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800
    "
    :class="[
      disabledComputed
        ? 'pointer-events-none opacity-80 cursor-not-allowed'
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
import Loader from "./Loader.vue";

export default {
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
};
</script>

<style></style>
