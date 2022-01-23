<template>
  <div class="flex items-baseline">
    <span
      class="text-gray-700"
      :class="{ 'text-gray-700 font-medium': required }"
    >
      {{ label }}
    </span>
    <span v-if="!required && label" class="ml-1.5 text-gray-700 text-sm">
      (optional)
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
