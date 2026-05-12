<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  label: string;
  icon: Component;
}>();
</script>

<template>
  <div class="flex gap-3">
    <dt class="shrink-0">
      <component
        :is="icon"
        class="mt-0.5 h-4 w-4 text-gray-400"
        aria-hidden="true"
      />
      <span class="sr-only">{{ label }}</span>
    </dt>
    <slot />
  </div>
</template>
