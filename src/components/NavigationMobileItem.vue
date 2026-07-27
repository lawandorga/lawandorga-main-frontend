<script lang="ts" setup>
import { NavigationItem } from "@/composables/useNavigationItems";

defineProps<{
  item: NavigationItem;
  active?: boolean;
}>();
</script>

<template>
  <component
    :is="item.is"
    v-bind="item.attrs"
    :aria-current="active ? 'page' : undefined"
    class="group flex items-center rounded-md px-2 py-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white"
    :class="{ 'bg-white/10 text-white': active }"
  >
    <component
      :is="item.icon"
      aria-hidden="true"
      class="mr-4 h-6 w-6 shrink-0"
    />
    {{ item.label }}
  </component>
</template>
