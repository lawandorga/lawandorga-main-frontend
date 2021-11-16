<template>
  <button
    type="button"
    class="
      inline-flex
      items-center
      px-6
      h-11
      border border-transparent
      text-sm
      font-medium
      rounded-md
      shadow-sm
      text-gray-500
      bg-white
      hover:text-gray-700
      focus:outline-none focus:ring-0 focus:bg-gray-50
    "
    :class="[
      disabledComputed
        ? 'pointer-events-none opacity-80 cursor-not-allowed'
        : '',
    ]"
    @click="emitClick()"
  >
    <Loader v-show="loading" color="text-white" class="mr-2" />
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "./CircleLoader.vue";

export default defineComponent({
  components: {
    Loader,
  },
  props: {
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
