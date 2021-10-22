<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <p
    v-if="FormHelptext"
    class="text-sm text-gray-500 mt-1"
    v-html="FormHelptext"
  ></p>
</template>

<script lang="ts">
export default {
  props: {
    FormHelptext: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>
