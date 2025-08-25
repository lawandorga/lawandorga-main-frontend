<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

interface TreeItem {
  id: number;
  name: string;
  children: number[];
}

export default defineComponent({
  name: "TreeItem",
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronRightIcon,
  },
  props: {
    item: {
      type: Object as PropType<TreeItem>,
      required: true,
    },
    items: {
      type: Array as PropType<TreeItem[]>,
      required: true,
    },
  },
  emits: ["clicked"],
  computed: {
    children() {
      return this.items.filter((items_item) =>
        this.item.children.includes(items_item.id),
      );
    },
  },
});
</script>

<template>
  <Disclosure v-slot="{ open }" as="li" class="mb-4">
    <div class="flex mb-2">
      <DisclosureButton>
        <div
          class="flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200"
        >
          <ChevronRightIcon
            class="w-5 h-5 text-gray-800"
            :class="{ 'transform rotate-90': open }"
          />
        </div>
      </DisclosureButton>
      <button
        type="button"
        class="flex items-baseline justify-between grow-0 ml-4 text-lg hover:underline"
        @click="$emit('clicked', item.id)"
      >
        <span>{{ item.name || "---" }}</span>
      </button>
    </div>
    <DisclosurePanel as="ul" class="pl-8">
      <TreeItem
        v-for="child in children"
        :key="child.id"
        :item="child"
        :items="items"
        @clicked="$emit('clicked', $event)"
      />
    </DisclosurePanel>
  </Disclosure>
</template>
