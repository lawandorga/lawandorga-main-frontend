<template>
  <TabGroup :selected-index="selectedTab" @change="changeTab">
    <TabList class="inline-flex w-full rounded">
      <template v-for="(tab, index) in internalTabs" :key="tab.key">
        <div v-if="tab.spacer" class="mx-auto"></div>
        <TabComponent v-else v-slot="{ selected }" as="template">
          <button
            :class="[
              'first:rounded-l last:rounded-r px-4 py-2.5 text-sm font-medium transition',
              'focus:outline-none shadow focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-gray-300 focus:z-10',
              selected
                ? 'bg-white text-gray-800'
                : 'text-gray-600 hover:bg-gray-50 bg-gray-100',
              internalTabs[index - 1]?.spacer
                ? 'rounded-l'
                : internalTabs[index + 1]?.spacer
                  ? 'rounded-r'
                  : '',
            ]"
            type="button"
          >
            {{ tab.name }}
            <span
              v-if="tab.badge"
              className="inline-flex items-center justify-center rounded-full w-5 h-5 bg-red-200 ml-1.5 text-xs font-medium text-red-800"
            >
              {{ tab.badge }}
            </span>
          </button>
        </TabComponent>
      </template>
    </TabList>
    <TabPanels class="mt-4">
      <template v-for="tab in internalTabs" :key="tab.key">
        <TabPanel
          v-if="!tab.spacer"
          :class="[
            'rounded focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-200 focus:ring-gray-300',
          ]"
        >
          <slot :name="tab.key" />
        </TabPanel>
      </template>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
import {
  TabGroup,
  TabList,
  Tab as TabComponent,
  TabPanels,
  TabPanel,
} from "@headlessui/vue";
import { ref, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

type Tab =
  | {
      name: string;
      key: string;
      badge?: number | string;
      spacer?: boolean;
    }
  | { spacer: true };

const props = defineProps<{ tabs: Tab[]; defaultTab?: number | string }>();

const emit = defineEmits(["clicked"]);

const { tabs, defaultTab } = toRefs(props);

const route = useRoute();
const router = useRouter();

// needed as copy because the headless ui tab component has a different tab order than the input
const internalTabs = ref<Tab[]>(tabs.value);

const selectedTab = ref(0);

const changeTab = (index: number) => {
  router.push({ path: route.path, query: { ...route.query, selected: index } });
  selectedTab.value = index;
  emit("clicked", index);
};

const updateTab = () => {
  internalTabs.value = [];

  const routeValue = parseInt(route.query.selected as string);
  const defaultValue = parseInt(defaultTab?.value as string);
  const selected: number = routeValue || defaultValue || 0;
  internalTabs.value = tabs.value;
  changeTab(selected);
};

updateTab();

watch([defaultTab, tabs], updateTab, { flush: "post" });
</script>
