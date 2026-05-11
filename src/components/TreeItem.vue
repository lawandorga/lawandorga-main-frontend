<script lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { defineComponent, PropType } from "vue";

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
    <div class="mb-2 flex">
      <DisclosureButton>
        <div
          class="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-gray-100 hover:bg-gray-200"
        >
          <ChevronRightIcon
            class="h-5 w-5 text-gray-800"
            :class="{ 'rotate-90 transform': open }"
          />
        </div>
      </DisclosureButton>
      <button
        type="button"
        class="ml-4 flex grow-0 items-baseline justify-between text-lg hover:underline"
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
