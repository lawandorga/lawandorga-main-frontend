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
    <div class="rounded bg-white shadow print:shadow-none">
      <div class="px-5 py-5 sm:px-6 print:hidden print:p-0">
        <div class="flex w-full items-baseline justify-between">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ title }}
          </h3>

          <div class="relative flex flex-nowrap space-x-3 print:hidden">
            <slot name="buttons" />
          </div>
        </div>
        <div
          class="mt-1 flex flex-col flex-wrap text-sm text-gray-500 lg:flex-row print:hidden"
        >
          <p
            v-for="stat in stats"
            :key="stat"
            class="max-w-full truncate whitespace-nowrap first:mr-4 last:mr-0"
          >
            {{ stat }}
          </p>
        </div>
      </div>
      <div
        class="border-t border-gray-200 print:m-0 print:border-0 print:p-0"
        :class="{ 'px-5 py-5 sm:px-6 sm:print:p-0': !nopadding }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
