<template>
  <TabGroup>
    <TabList class="inline-flex rounded shadow">
      <Tab
        v-for="tab in tabs"
        :key="tab.key"
        v-slot="{ selected }"
        as="template"
      >
        <button
          :class="[
            'first:rounded-l last:rounded-r px-4 py-2.5 text-sm font-medium transition',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-gray-300 focus:z-10',
            selected
              ? 'bg-white text-gray-800'
              : 'text-gray-600 hover:bg-gray-50 bg-gray-100',
          ]"
          type="button"
        >
          {{ tab.name }}
        </button>
      </Tab>
    </TabList>
    <TabPanels class="mt-4">
      <TabPanel
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'rounded focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-200 focus:ring-gray-300',
        ]"
      >
        <slot :name="tab.key" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

interface ITab {
  name: string;
  key: string;
}

defineProps<{ tabs: ITab[] }>();
</script>
