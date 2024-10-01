<template>
  <div
    class="sticky top-0 overflow-hidden bg-white rounded shadow print:hidden"
  >
    <ul class="">
      <li
        v-if="!grouping"
        class="flex flex-wrap px-4 py-3 gap-x-5 gap-y-1 sm:px-6 bg-gray-50"
      >
        <component
          :is="button"
          v-for="button in ungroupedButtons"
          :key="button"
        />
      </li>

      <li
        v-for="(item, index) in groups"
        :key="item.type"
        class="relative w-full"
      >
        <button
          v-show="grouping"
          class="w-full"
          @click="selected(item.type, null)"
        >
          <FolderNavigationGroup
            :name="item.name"
            :buttons="item.buttons"
            :is-first="index === 0 && grouping"
            :is-selected="selectedType === item.type"
            :badge="item.badge"
          />
        </button>

        <div
          v-show="
            (!grouping || selectedType === item.type) && item.children.length
          "
          class="border-t border-gray-200 divide-y divide-gray-200"
        >
          <button
            v-for="child in item.children"
            :key="`${child.name}/${child.id}`"
            class="w-full"
            @click="selected(item.type, child.id)"
          >
            <FolderNavigationChild
              :type="child.type"
              :name="child.name"
              :show-type="!grouping"
              :small="!grouping"
              :is-selected="selectedId === child.id"
            />
          </button>
        </div>
      </li>

      <li
        v-if="!hideGroupingControl"
        class="px-4 py-3 space-x-5 bg-gray-100 border-t-4 border-gray-200 sm:px-6"
      >
        <ButtonToggle
          :model-value="grouping"
          text="Grouping"
          @update:model-value="emit('grouping', $event)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export interface ContentItem {
  id: number | string | null;
  created?: string;
  name: string;
  type: string;
}

export interface ContentGroupItem {
  type: string;
  name: string;
  children: ContentItem[];
  buttons: VNode[];
  badge?: string;
}

import { ButtonToggle } from "lorga-ui";
import { VNode } from "vue";
import FolderNavigationChild from "@/features/folders/components/FolderNavigationChild.vue";
import FolderNavigationGroup from "@/features/folders/components/FolderNavigationGroup.vue";
import { useRoute, useRouter } from "vue-router";

defineProps<{
  grouping: boolean;
  groups: ContentGroupItem[];
  ungroupedButtons: VNode[];
  selectedType: string;
  selectedId: string | number | null;
  hideGroupingControl?: boolean;
}>();

const emit = defineEmits(["grouping", "selected"]);

const route = useRoute();
const router = useRouter();

const selected = (type: string, id: string | number | null) => {
  emit("selected", { type, id });
  router.push({
    path: route.path,
    query: { ...route.query, selectedType: type, selectedId: id },
  });
};
</script>
