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
        class="w-4 h-4 text-gray-400 mt-0.5"
        aria-hidden="true"
      />
      <span class="sr-only">{{ label }}</span>
    </dt>
    <slot />
  </div>
</template>
