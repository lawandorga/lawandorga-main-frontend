<script setup lang="ts">
import { CircleLoader } from "lorga-ui";

withDefaults(
  defineProps<{
    show?: boolean;
  }>(),
  {
    show: false,
  },
);
</script>

<template>
  <div>
    <div v-if="show"><slot /></div>
    <div v-if="!show">
      <div class="flex items-center">
        <CircleLoader class="mr-2" />
        <div class="text-lg font-medium text-gray-600">
          One moment please. Loading...
        </div>
      </div>
    </div>
  </div>
</template>
