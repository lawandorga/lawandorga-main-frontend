<template>
  <div class="hidden md:flex md:flex-shrink-0 print:hidden">
    <div class="flex flex-col" :class="{ 'w-64': expanded, 'w-14': !expanded }">
      <div class="flex flex-col flex-grow overflow-y-auto bg-lorgablue">
        <div
          class="flex items-center flex-shrink-0 h-16 border-b border-white border-opacity-20"
          :class="{ 'border-r': !expanded }"
        >
          <button
            class="flex items-center justify-center w-10 h-10 border border-transparent rounded focus:outline-none hover:bg-gray-50/10"
            :class="{ 'mx-auto': !expanded, 'ml-2 mr-2': expanded }"
            @click="expanded = !expanded"
          >
            <Bars3CenterLeftIcon class="w-6 h-6 text-white" />
          </button>
          <router-link
            v-show="expanded"
            :to="{ name: 'user-login' }"
            class="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
            <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
          </router-link>
        </div>
        <div
          v-show="expanded"
          class="flex-col px-4 py-3 text-white border-b border-white border-opacity-20"
        >
          <div class="truncate">
            {{ userStore.rlc?.name }}: {{ userStore.user?.name }}
          </div>
          <div class="truncate">{{ userStore.user?.email }}</div>
        </div>
        <div v-show="!expanded" class="flex items-center justify-center h-14">
          <router-link
            :to="{ name: 'user-login' }"
            class="flex items-center justify-center w-10 h-10 mx-auto rounded hover:bg-gray-50/10"
          >
            <svg
              class="w-8 h-8"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="256px"
              height="256px"
              viewBox="0 0 256 256"
              enable-background="new 0 0 256 256"
              xml:space="preserve"
            >
              <g id="Hintergrund"></g>
              <g id="Ebene_1">
                <path
                  fill="#FFFFFF"
                  d="M55,201h104v44H11V127.727C11,98.287,22.764,71.45,40.834,51l30.083,31C60.776,94.41,55,110.438,55,127.717
		V201z"
                />
                <path
                  fill="#FFFFFF"
                  d="M127.667,19c29.116,0,56.395,11.055,76.981,31.644c20.587,20.587,32.019,48.243,32.019,77.356
		c0,24.463-7.286,47.124-22,66l-22-21c8.806-12.858,14-28.238,14-45c0-43.561-35.439-79-79-79c-16.636,0-32.94,5.062-46,14l-21-22
		C79.892,26.09,103.24,19,127.667,19L127.667,19z M127.667,12c-26,0-52.314,9.087-72.095,24.777
		c-1.73,1.359-3.256,2.732-4.905,4.223l30,31c12.46-10.329,29.56-16,47-16c39.76,0,72,32.24,72,72c0,17.439-5.67,33.539-16,46l31,30
		c18.25-20.48,29-46.4,29-76C243.667,63.939,190.667,12,127.667,12L127.667,12z"
                />
              </g>
            </svg>
          </router-link>
        </div>
        <div class="flex flex-col justify-between flex-grow bg-white">
          <nav
            class="flex-1 pb-2 bg-white"
            :class="{
              'space-y-3 pt-3': !expanded,
              'space-y-1 px-2 pt-2': expanded,
            }"
          >
            <template v-for="item in navigationItems" :key="item.label">
              <div v-if="item.divider">
                <div
                  class=""
                  :class="{
                    'w-full py-4': expanded,
                    'w-10 py-0.5 mx-auto': !expanded,
                  }"
                >
                  <div
                    class="w-full border-t"
                    :class="{
                      'border-gray-100': expanded,
                      'border-gray-300': !expanded,
                    }"
                  ></div>
                </div>
              </div>
              <component
                :is="item.is"
                v-else
                v-bind="item.attrs"
                active-class="text-gray-700 !bg-gray-100 hover:bg-gray-100"
                class="relative flex items-center justify-between py-2 pl-2 text-sm font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
                :class="{
                  '!pb-[1.375rem]': !expanded && item.is === 'a',
                  'w-10 pr-2 mx-auto': !expanded,
                  'pr-3': expanded,
                }"
              >
                <div class="flex items-center">
                  <component
                    :is="item.icon"
                    class="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-gray-500"
                    :class="{ 'mr-3': expanded }"
                  />
                  <span
                    v-show="expanded || item.is === 'a'"
                    :class="{
                      'text-xs absolute block bold top-8 truncate left-0 right-0 text-center text-gray-500':
                        !expanded,
                    }"
                  >
                    {{ item.label }}
                  </span>
                </div>
                <div
                  v-if="item.notifications && item.notifications > 0"
                  class="flex items-center justify-center w-6 h-6 text-sm font-bold text-red-800 bg-red-200 rounded-full"
                  :class="{
                    'absolute top-1 right-1 !w-4 !h-4 !text-xs': !expanded,
                  }"
                >
                  {{ item.notifications }}
                </div>
              </component>
            </template>
          </nav>
          <div
            v-show="expanded"
            class="flex flex-col items-start justify-center px-4 pb-4"
          >
            <figure class="mb-3">
              <figcaption class="mb-1 text-gray-500">A project of</figcaption>
              <a href="https://rlc-deutschland.de/" target="_blank">
                <img
                  src="/rlcd.png"
                  alt="RLC Deutschland"
                  class="h-auto px-2 py-2 overflow-hidden border-2 border-gray-200 rounded-md shadow w-36"
                />
              </a>
            </figure>
            <figure>
              <figcaption class="mb-1 text-gray-500">supported by</figcaption>
              <a href="https://www.cms-stiftung.de/" target="_blank">
                <img
                  src="/sponsor-cms.jpg"
                  alt="CMS Stiftung"
                  class="w-full h-auto overflow-hidden border-2 border-gray-200 rounded-md shadow"
                />
              </a>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import useNavigationItems from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";
import { ref } from "vue";

const { navigationItems } = useNavigationItems();
const userStore = useUserStore();

const expanded = ref(false);
</script>
