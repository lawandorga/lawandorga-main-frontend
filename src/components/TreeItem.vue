<template>
  <Disclosure v-slot="{ open }" as="li" class="mb-4">
    <div class="flex mb-2">
      <DisclosureButton>
        <div
          class="
            flex
            items-center
            justify-center
            bg-gray-100
            w-6
            h-6
            rounded
            border border-gray-200
            hover:bg-gray-200
          "
        >
          <ChevronRightIcon
            class="w-5 h-5 text-gray-800"
            :class="{ 'transform rotate-90': open }"
          />
        </div>
      </DisclosureButton>
      <button
        type="button"
        class="
          flex
          text-lg
          hover:underline
          items-baseline
          justify-between
          flex-grow-0
          ml-4
        "
        @click="$emit('clicked', item.pk)"
      >
        <span>{{ item.name }}</span>
        <!-- <span class="text-sm text-gray-500">({{ item.children.length }})</span> -->
      </button>
    </div>
    <DisclosurePanel as="ul" class="pl-8">
      <TreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        @clicked="$emit('clicked', $event)"
      />
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon } from "@heroicons/vue/solid";

interface TreeItem {
  pk: number;
  name: string;
  children?: TreeItem[];
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
  },
  emits: ["clicked"],
});
</script>