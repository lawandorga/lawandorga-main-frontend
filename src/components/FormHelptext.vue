<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <p v-if="helptext" class="text-sm text-gray-500 mt-1" v-html="helptext"></p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    helptext: {
      type: String,
      required: false,
      default: "",
    },
  },
});
</script>
