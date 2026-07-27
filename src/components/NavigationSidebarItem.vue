<script lang="ts" setup>
import { NavigationItem } from "@/composables/useNavigationItems";

import RedBadge from "./RedBadge.vue";

defineProps<{
  item: NavigationItem;
  expanded: boolean;
  active?: boolean;
}>();
</script>

<template>
  <component
    :is="item.is"
    v-bind="item.attrs"
    :aria-label="item.label"
    :aria-current="active ? 'page' : undefined"
    class="group relative flex items-center justify-between rounded-md py-2 pl-2 text-sm font-medium hover:bg-white/10 hover:text-white"
    :class="[
      active ? 'bg-white/10 text-white' : 'text-white/70',
      {
        'pb-5.5!': !expanded && item.is === 'a',
        'mx-auto w-10 pr-2': !expanded,
        'pr-3': expanded,
      },
    ]"
  >
    <div class="flex items-center">
      <component
        :is="item.icon"
        aria-hidden="true"
        class="h-6 w-6 shrink-0"
        :class="{ 'mr-3': expanded }"
      />
      <div
        v-show="expanded || item.is === 'a'"
        :class="{
          'absolute top-8 right-0 left-0 truncate text-center text-xs font-bold':
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
