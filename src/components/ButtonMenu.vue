<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="
          inline-flex
          rounded-lg
          relative
          group
          py-0.5
          font-normal
          bg-gray-100
          text-gray-700
          border-2 border-gray-200
          hover:border-gray-300 hover:bg-gray-200 hover:text-gray-800
          focus:outline-none
          focus:ring-1
          focus:ring-gray-200
          focus:ring-offset-1
        "
      >
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <div
          class="
            absolute
            inset-0
            w-full
            h-full
            flex
            items-center
            justify-center
          "
        >
          <DotsVerticalIcon class="w-5 h-5 text-gray-500 hover:text-gray-600" />
        </div>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        :unmount="false"
        class="
          absolute
          right-0
          w-40
          mt-2
          origin-top-right
          bg-gray-100
          border border-gray-200
          divide-y divide-gray-200
          rounded-md
          shadow-xs
          ring-1 ring-black ring-opacity-5
          focus:outline-none
        "
      >
        <div v-for="item in items" :key="item.name" class="px-1 py-1">
          <MenuItem>
            <button
              class="
                text-gray-600
                group
                flex
                rounded-md
                items-center
                w-full
                px-2
                py-2
                text-sm
                hover:bg-gray-200 hover:text-gray-700
              "
              @click="$emit('click', item.id)"
            >
              {{ item.name }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { DotsVerticalIcon } from "@heroicons/vue/outline";
import { defineComponent, PropType } from "vue";
import { VoidFunction } from "@/types/shared";

interface Item {
  name: string;
  id: string;
  action: VoidFunction;
}

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    ChevronDownIcon,
    DotsVerticalIcon,
  },
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
  emits: ["click"],
});
</script>
