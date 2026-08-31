<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

defineProps<{
  title: string;
  numberOfItems?: number;
}>();
</script>

<template>
  <Disclosure v-slot="{ open }" default-open>
    <div class="rounded-xl bg-white shadow-md">
      <div class="flex justify-between px-6 py-4">
        <h2>
          <DisclosureButton
            class="flex cursor-pointer items-center gap-2 text-gray-400"
          >
            <span class="text-lg leading-6 font-medium text-gray-700">
              {{ title }}
            </span>
            <span
              v-if="numberOfItems"
              class="rounded-md bg-gray-200 px-2 py-0.5 font-medium text-gray-800"
            >
              {{ numberOfItems }}<span class="sr-only"> entries</span>
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              class="size-5 transition-transform duration-200"
              :class="{ '-rotate-180': !open }"
            />
          </DisclosureButton>
        </h2>
        <div v-if="$slots.action" class="flex items-center gap-2">
          <slot name="action" />
        </div>
      </div>
      <!-- static so the panel stays mounted and v-show owns visibility -->
      <DisclosurePanel v-show="open" static class="border-t-2 border-gray-200">
        <slot />
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>
