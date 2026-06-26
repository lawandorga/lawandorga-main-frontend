<script lang="ts" setup>
import { NavigationItem } from "@/composables/useNavigationItems";

import RedBadge from "./RedBadge.vue";

defineProps<{
  item: NavigationItem;
  expanded: boolean;
  active: boolean;
}>();
</script>

<template>
  <div v-if="item.divider">
    <div
      :class="{
        'mt-4 w-full': expanded,
        'mx-auto w-10 py-0.5': !expanded,
      }"
    >
      <div
        class="w-full border-t pt-2"
        :class="{
          'border-white/20': expanded,
          'border-white/50': !expanded,
        }"
      >
        <span class="block px-2 text-xs text-white/50 uppercase">
          External Links
        </span>
      </div>
    </div>
  </div>
  <component
    v-else
    :is="item.is"
    v-bind="item.attrs"
    class="group relative flex items-center justify-between rounded-md py-2 pl-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
    :class="{
      'bg-white/10': active,
      'pb-5.5!': !expanded && item.is === 'a',
      'mx-auto w-10 pr-2': !expanded,
      'pr-3': expanded,
    }"
  >
    <div class="flex items-center">
      <component
        :is="item.icon"
        class="h-6 w-6 shrink-0 text-white/60 group-hover:text-white"
        :class="{ 'mr-3': expanded }"
      />
      <div
        v-show="expanded || item.is === 'a'"
        :class="{
          'absolute top-8 right-0 left-0 truncate text-center text-xs font-bold text-gray-500':
            !expanded,
        }"
      >
        {{ item.label }}
      </div>
    </div>
    <RedBadge
      v-if="item.notifications && item.notifications > 0"
      :additional-classes="
        expanded ? '' : 'absolute top-1 right-1 w-4! h-4! text-xs!'
      "
    >
      {{ item.notifications }}
    </RedBadge>
  </component>
</template>
