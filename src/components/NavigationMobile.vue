<script lang="ts" setup>
import {
  Dialog as HeadlessDialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

import useNavigationItems from "@/composables/useNavigationItems";

import NavigationMobileItem from "./NavigationMobileItem.vue";

defineProps<{
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}>();

const { navigationItems, externalLinks, isNavigationItemActive } =
  useNavigationItems();
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
          <DialogOverlay class="fixed inset-0 bg-gray-600/75" />
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
            class="bg-formcolor relative flex w-full max-w-xs flex-1 flex-col pb-4"
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
            <div
              class="flex h-16 shrink-0 items-center border-b border-white/20 px-4"
            >
              <router-link to="/" class="flex items-center space-x-2">
                <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
                <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
              </router-link>
            </div>
            <nav
              aria-label="Main"
              class="h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2"
            >
              <NavigationMobileItem
                v-for="item in navigationItems"
                :key="item.label"
                :item="item"
                :active="isNavigationItemActive(item)"
                @click="setOpen(false)"
              />
            </nav>
            <nav
              v-if="externalLinks.length"
              aria-label="External links"
              class="shrink-0 space-y-1 border-t border-white/20 px-2 py-2"
            >
              <span class="block px-2 text-xs text-white/50 uppercase">
                External Links
              </span>
              <NavigationMobileItem
                v-for="link in externalLinks"
                :key="link.label"
                :item="link"
                @click="setOpen(false)"
              />
            </nav>
          </div>
        </TransitionChild>
        <div class="w-14 shrink-0" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </HeadlessDialog>
    </TransitionRoot>
  </div>
</template>
