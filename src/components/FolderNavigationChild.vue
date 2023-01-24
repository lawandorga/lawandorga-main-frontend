<template>
  <div
    class="relative block w-full px-4 sm:px-6"
    :class="{
      'py-4 px-6 sm:px-8': !small,
      'py-3': small,
    }"
  >
    <div
      v-show="isSelected"
      class="absolute inset-y-0 right-0 w-1 bg-gray-300"
    ></div>

    <div class="flex items-center justify-between">
      <p class="text-sm font-medium truncate text-lorgablue">
        {{ name }}
      </p>
      <div v-if="showType" class="flex flex-shrink-0 ml-2">
        <p
          class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-sky-800 bg-sky-100"
        >
          {{ type }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string;
  showType: boolean;
  name: string;
  isSelected: boolean;
  small: boolean;
}>();
</script>
