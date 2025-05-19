<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
  stats: string[];
  nopadding?: boolean;
}>();
</script>

<template>
  <div v-show="show">
    <div class="bg-white rounded shadow print:shadow-none">
      <div class="px-5 py-5 sm:px-6 print:p-0 print:hidden">
        <div class="flex items-baseline justify-between w-full">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ title }}
          </h3>

          <div class="relative flex space-x-3 flex-nowrap print:hidden">
            <slot name="buttons" />
          </div>
        </div>
        <div
          class="flex flex-col flex-wrap mt-1 text-sm text-gray-500 lg:flex-row print:hidden"
        >
          <p
            v-for="stat in stats"
            :key="stat"
            class="max-w-full truncate first:mr-4 last:mr-0 whitespace-nowrap"
          >
            {{ stat }}
          </p>
        </div>
      </div>
      <div
        class="border-t border-gray-200 print:m-0 print:p-0 print:border-0"
        :class="{ 'px-5 py-5 sm:px-6 sm:print:p-0': !nopadding }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
