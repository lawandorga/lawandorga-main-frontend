<template>
  <TabGroup :default-index="defaultIndex">
    <TabList class="inline-flex w-full rounded">
      <template v-for="(tab, index) in tabs" :key="tab.key">
        <div v-if="tab.spacer" class="mx-auto"></div>
        <Tab v-else v-slot="{ selected }" as="template">
          <button
            :class="[
              'first:rounded-l last:rounded-r px-4 py-2.5 text-sm font-medium transition',
              'focus:outline-none shadow focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-gray-300 focus:z-10',
              selected
                ? 'bg-white text-gray-800'
                : 'text-gray-600 hover:bg-gray-50 bg-gray-100',
              tabs[index - 1]?.spacer
                ? 'rounded-l'
                : tabs[index + 1]?.spacer
                ? 'rounded-r'
                : '',
            ]"
            type="button"
            @click="clicked(tab.key)"
          >
            {{ tab.name }}
          </button>
        </Tab>
      </template>
    </TabList>
    <TabPanels class="mt-4">
      <template v-for="tab in tabs" :key="tab.key">
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
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

type ITab =
  | {
      name: string;
      key: string;
      spacer?: boolean;
    }
  | { spacer: true };

const props = defineProps<{ tabs: ITab[]; defaultTab?: string }>();

const emit = defineEmits(["clicked"]);

const { tabs, defaultTab } = toRefs(props);

const route = useRoute();
const router = useRouter();

const clicked = (key: string) => {
  router.push({ path: route.path, query: { ...route.query, selected: key } });
  emit("clicked", key);
};

let defaultIndex = 0;

if (route.query.selected || defaultTab?.value) {
  const selected = route.query.selected || defaultTab?.value;
  const index = tabs.value.findIndex((t) => t.key === selected);
  defaultIndex = index;
}
</script>
