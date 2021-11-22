<template>
  <component
    :is="is"
    class="font-medium hover:text-opacity-[85%] text-sm"
    :class="{
      'text-lorgablue': color === 'blue',
      'text-red-600': color === 'red',
    }"
    :href="href"
    :type="type"
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
    color: {
      type: String,
      default: "blue",
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
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
});
</script>
