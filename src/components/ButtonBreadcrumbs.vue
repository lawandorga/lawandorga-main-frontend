<template>
  <component
    :is="is"
    class="inline-flex items-center text-center px-6 min-h-[2.75rem] border border-transparent text-base font-medium rounded-md shadow-sm text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-0 focus:bg-gray-50"
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
    <CircleLoader v-show="loading" color="text-white" class="mr-2" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CircleLoader } from "lorga-ui";

export default defineComponent({
  components: {
    CircleLoader,
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
