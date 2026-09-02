<script setup lang="ts">
import { ref, watch } from "vue";

import { Folder } from "@/features/folders/api/useFolderPage";

const props = defineProps<{
  items: Folder[];
  // eslint-disable-next-line no-unused-vars -- function type parameter name, not an unused variable
  command: (selected: { id: string; label: string }) => void;
}>();

const selectedIndex = ref(0);

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  },
);

const selectItem = (index: number) => {
  const folder = props.items[index];
  if (folder) props.command({ id: folder.uuid, label: folder.name });
};

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === "ArrowUp") {
    selectedIndex.value =
      (selectedIndex.value + props.items.length - 1) % props.items.length;
    return true;
  }
  if (event.key === "ArrowDown") {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    return true;
  }
  if (event.key === "Enter") {
    selectItem(selectedIndex.value);
    return true;
  }
  return false;
};

defineExpose({ onKeyDown });
</script>

<template>
  <div
    class="max-h-60 w-64 overflow-y-auto rounded-md border border-gray-300 bg-white p-1 shadow-lg"
  >
    <button
      v-for="(folder, index) in items"
      :key="folder.uuid"
      type="button"
      class="block w-full rounded-md px-2 py-1 text-left text-sm"
      :class="
        index === selectedIndex ? 'bg-gray-900 text-white' : 'text-gray-900'
      "
      @click="selectItem(index)"
    >
      📁 {{ folder.name }}
    </button>
    <div v-if="items.length === 0" class="px-2 py-1 text-sm text-gray-500">
      Keine Folder gefunden
    </div>
  </div>
</template>
