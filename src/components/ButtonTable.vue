<template>
  <div>
    <button
      type="button"
      class="inline-flex items-center px-2 py-0.5 -mx-2 border border-transparent text-sm font-medium rounded focus:outline-none"
      :class="{
        'pointer-events-none opacity-40 cursor-not-allowed': disabledComputed,
        'text-blue-800 hover:text-blue-900 hover:bg-blue-50 focus:border-blue-200':
          type === 'NORMAL' || type === 'CREATE',
        'text-red-600 hover:text-red-700 hover:bg-red-50 focus:border-red-200':
          type === 'DELETE',
        'text-green-600 hover:text-green-700 hover:bg-green-50 focus:border-green-200':
          type === '',
      }"
      :disabled="disabledComputed"
      @click="emitClick()"
    >
      <Loader v-show="loading" color="text-white" class="mr-2" />
      <div ref="content">
        <slot />
      </div>
    </button>
  </div>
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
  data() {
    return {
      type: "NORMAL",
    };
  },
  computed: {
    disabledComputed() {
      if (this.loading) return true;
      return this.disabled;
    },
  },
  mounted() {
    let text = "delete";
    if (this.$refs.content)
      text = (this.$refs.content as HTMLElement).textContent || "";
    if (text.toLowerCase().includes("delet")) this.type = "DELETE";
    if (text.toLowerCase().includes("remove")) this.type = "DELETE";
    else if (text.toLowerCase().includes("add")) this.type = "CREATE";
    else if (text.toLowerCase().includes("create")) this.type = "CREATE";
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
});
</script>

<style></style>
