<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      class="fixed inset-0 flex z-40 md:hidden print:hidden"
      @close="setOpen(false)"
    >
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="transition ease-in-out duration-300 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      >
        <div
          class="relative flex-1 flex flex-col max-w-xs w-full pb-4 bg-white"
        >
          <TransitionChild
            as="template"
            enter="ease-in-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in-out duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                @click="setOpen(false)"
              >
                <span class="sr-only">Close sidebar</span>
                <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </TransitionChild>
          <div class="flex-shrink-0 h-16 flex items-center px-4 bg-lorgablue">
            <router-link to="/" class="flex space-x-2 items-center">
              <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
              <h1 class="text-white font-bold text-2xl">Law&Orga</h1>
            </router-link>
          </div>
          <div class="flex-1 h-0 overflow-y-auto">
            <nav class="py-2 px-2 space-y-1">
              <router-link
                v-for="item in sidebarItems"
                :key="item.link"
                :to="item.link"
                to-active="bg-gray-100 hover:bg-gray-100 text-gray-700"
                class="group text-gray-600 group hover:bg-gray-50 hover:text-gray-900 flex items-center px-2 py-2 text-base font-medium rounded-md"
                @click="setOpen(false)"
              >
                <component
                  :is="item.icon"
                  class="text-gray-400 mr-4 flex-shrink-0 h-6 w-6 group-hover:text-gray-500"
                />
                {{ item.label }}
              </router-link>
            </nav>
          </div>
        </div>
      </TransitionChild>
      <div class="flex-shrink-0 w-14" aria-hidden="true">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import useNavigationItems from "@/composables/useNavigationItems";
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    XMarkIcon,
    Dialog,
    DialogOverlay,
    TransitionChild,
    TransitionRoot,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    setOpen: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const { navigationItems } = useNavigationItems();

    return {
      sidebarItems: navigationItems,
    };
  },
});
</script>
