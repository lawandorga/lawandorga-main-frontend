<script lang="ts">
import { defineComponent } from "vue";
import { ButtonNormal, CircleLoader } from "lorga-ui";

export default defineComponent({
  components: {
    CircleLoader,
    ButtonNormal,
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

<template>
  <ButtonNormal
    :is="is"
    kind="secondary"
    :to="to"
    :href="href"
    :disabled="disabledComputed"
    :type="type"
    @click="emitClick()"
  >
    <CircleLoader v-show="loading" color="text-white" class="mr-2" />
    <slot />
  </ButtonNormal>
</template>
