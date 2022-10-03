<template>
  <div v-show="show">
    <div class="bg-white rounded shadow">
      <div class="flex justify-between px-5 py-5 sm:px-6">
        <div class="flex-shrink">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ title }}
          </h3>
          <div
            class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
          >
            <p v-for="stat in stats" :key="stat">{{ stat }}</p>
          </div>
        </div>
        <div class="space-x-3"></div>
      </div>
      <div class="px-5 py-5 border-t border-gray-200 sm:px-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; title: string; stats: string[] }>();
</script>
