<script setup lang="ts">
defineProps<{
  type: string;
  showType: boolean;
  name: string;
  isSelected: boolean;
  small: boolean;
}>();
</script>

<template>
  <div
    class="relative block w-full px-4 sm:px-6"
    :class="{
      'px-6 py-4 sm:px-8': !small,
      'py-3': small,
    }"
  >
    <div
      v-show="isSelected"
      class="absolute inset-y-0 right-0 w-1 bg-gray-300"
    ></div>

    <div class="flex items-center justify-between">
      <p class="text-formcolor truncate text-sm font-medium">
        {{ name }}
      </p>
      <div v-if="showType" class="ml-2 flex shrink-0">
        <p
          class="inline-flex rounded-full bg-sky-100 px-2 text-xs leading-5 font-semibold text-sky-800"
        >
          {{ type }}
        </p>
      </div>
    </div>
  </div>
</template>
