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
        'w-full mt-4': expanded,
        'w-10 py-0.5 mx-auto': !expanded,
      }"
    >
      <div
        class="w-full pt-2 border-t"
        :class="{
          'border-white/20': expanded,
          'border-white/50': !expanded,
        }"
      >
        <span class="block px-2 text-xs uppercase text-white/50">
          External Links
        </span>
      </div>
    </div>
  </div>
  <component
    v-else
    :is="item.is"
    v-bind="item.attrs"
    class="relative flex items-center justify-between py-2 pl-2 text-sm font-medium rounded-md group text-white/70 hover:bg-white/10 hover:text-white"
    :class="{
      'bg-white/10': active,
      'pb-5.5!': !expanded && item.is === 'a',
      'w-10 pr-2 mx-auto': !expanded,
      'pr-3': expanded,
    }"
  >
    <div class="flex items-center">
      <component
        :is="item.icon"
        class="w-6 h-6 text-white/60 shrink-0 group-hover:text-white"
        :class="{ 'mr-3': expanded }"
      />
      <div
        v-show="expanded || item.is === 'a'"
        :class="{
          'text-xs absolute font-bold top-8 truncate left-0 right-0 text-center text-gray-500':
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
