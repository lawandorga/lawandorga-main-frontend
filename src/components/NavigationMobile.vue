<template>
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
          class="relative flex flex-col flex-1 w-full max-w-xs pb-4 bg-white"
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
            <div class="absolute top-0 right-0 pt-2 -mr-12">
              <button
                type="button"
                class="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                @click="setOpen(false)"
              >
                <span class="sr-only">Close sidebar</span>
                <XMarkIcon class="w-6 h-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </TransitionChild>
          <div class="flex items-center flex-shrink-0 h-16 px-4 bg-lorgablue">
            <router-link to="/" class="flex items-center space-x-2">
              <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
              <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
            </router-link>
          </div>
          <div class="flex-1 h-0 overflow-y-auto">
            <nav class="px-2 py-2 space-y-1">
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
                  class="flex items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
                  @click="setOpen(false)"
                >
                  <component
                    :is="item.icon"
                    class="flex-shrink-0 w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500"
                  />
                  {{ item.label }}
                </component>
              </template>
            </nav>
          </div>
        </div>
      </TransitionChild>
      <div class="flex-shrink-0 w-14" aria-hidden="true">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </HeadlessDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import useNavigationItems from "@/composables/useNavigationItems";
import {
  Dialog as HeadlessDialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { defineComponent } from "vue";

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
