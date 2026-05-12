<script lang="ts">
import {
  Dialog as HeadlessDialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

import useNavigationItems from "@/composables/useNavigationItems";

export default defineComponent({
  components: {
    XMarkIcon,
    HeadlessDialog,
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

<template>
  <div class="print:hidden">
    <TransitionRoot as="template" :show="open">
      <HeadlessDialog
        as="div"
        class="fixed inset-0 z-40 flex md:hidden print:hidden"
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
          <DialogOverlay class="bg-opacity-75 fixed inset-0 bg-gray-600" />
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
            class="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4"
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
                  class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                  @click="setOpen(false)"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <div class="bg-formcolor flex h-16 shrink-0 items-center px-4">
              <router-link to="/" class="flex items-center space-x-2">
                <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
                <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
              </router-link>
            </div>
            <div class="h-0 flex-1 overflow-y-auto">
              <nav class="space-y-1 px-2 py-2">
                <template v-for="item in sidebarItems" :key="item.label">
                  <div v-if="item.divider">
                    <div class="w-full py-4">
                      <div class="w-full border-t border-gray-100"></div>
                    </div>
                  </div>
                  <component
                    :is="item.is"
                    v-else
                    v-bind="item.attrs"
                    to-active="bg-gray-100 hover:bg-gray-100 text-gray-700"
                    class="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    @click="setOpen(false)"
                  >
                    <component
                      :is="item.icon"
                      class="mr-4 h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    {{ item.label }}
                  </component>
                </template>
              </nav>
            </div>
          </div>
        </TransitionChild>
        <div class="w-14 shrink-0" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </HeadlessDialog>
    </TransitionRoot>
  </div>
</template>
