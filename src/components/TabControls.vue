<template>
  <TabGroup :selected-index="selectedTab" @change="changeTab">
    <TabList class="inline-flex w-full gap-6 rounded">
      <template v-for="tab in internalTabs" :key="tab.key">
        <div v-if="'spacer' in tab" class="mx-auto"></div>
        <TabComponent v-else v-slot="{ selected }" as="template">
          <button
            :class="[
              'py-2.5 pr-3 text-lg font-semibold',
              selected ? 'border-b-2 border-solid' : '',
              tab.highlighted
                ? ' text-formcolor border-formcolor'
                : 'text-gray-600 border-gray-600',
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
    <TabPanels>
      <template v-for="tab in internalTabs" :key="tab.key">
        <TabPanel
          v-if="!Object.keys(tab).includes('spacer')"
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
      highlighted?: boolean;
    }
  | { key: string; spacer: boolean };

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
