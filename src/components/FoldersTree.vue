<template>
  <template v-for="(item, index) in folders" :key="item.folder.uuid">
    <div
      class="flex w-full leading-snug rounded-sm h-7 even:bg-gray-100 odd:bg-white"
      :style="{ paddingLeft: `${depth * 18}px` }"
    >
      <button
        class="w-5 text-gray-900 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
        @click="chevronClicked(index)"
      >
        <ChevronUpIcon
          :class="open.includes(index) ? 'rotate-180 transform' : 'rotate-90'"
          class="w-5 h-5 text-gray-500"
        />
      </button>
      <div class="flex items-center">
        <button
          class="flex items-center max-w-xs transition focus:outline-none hover:underline group"
          @click="emit('folderClicked', item.folder.uuid)"
        >
          <FolderIcon
            class="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-gray-600"
          />
          <span class="ml-1.5 truncate mr-3">{{ item.folder.name }}</span>
        </button>
        <div
          v-if="properties[item.folder.uuid]"
          class="px-1 py-0 text-xs font-medium leading-tight tracking-wide text-gray-800 uppercase rounded shadow whitespace-nowrap ring-1 ring-gray-700"
        >
          {{ properties[item.folder.uuid] }}
        </div>
        <div class="ml-3">
          <ButtonNormal
            v-if="item.folder.actions.OPEN"
            kind="action"
            :to="{
              name: 'folders-detail',
              params: { uuid: item.folder.actions.OPEN.uuid },
            }"
          >
            Open
          </ButtonNormal>
        </div>
      </div>
      <div class="flex items-center pr-2 ml-auto space-x-3 whitespace-nowrap">
        <ButtonNormal
          kind="action"
          @click="emit('addContentClicked', item.folder.uuid)"
        >
          Add Content
        </ButtonNormal>
        <ButtonNormal
          kind="action"
          @click="emit('addChildClicked', item.folder.uuid)"
        >
          Add Child
        </ButtonNormal>
      </div>
    </div>
    <template v-if="open.includes(index)">
      <div
        v-for="content in item.content"
        :key="content.name"
        class="even:bg-gray-100 odd:bg-white"
      >
        <div class="flex items-center">
          <div :style="{ width: `${(depth + 1) * 18}px` }"></div>
          <div class="block w-5 h-5"></div>
          <FoldersBadge>
            {{ content.repository }}
          </FoldersBadge>
          <div class="ml-2 text-sm leading-normal">
            {{ content.name }}
          </div>
        </div>
      </div>
      <FoldersTree
        v-if="item.children.length"
        :depth="depth + 1"
        :folders="item.children"
        @add-child-clicked="emit('addChildClicked', $event)"
        @add-content-clicked="emit('addContentClicked', $event)"
        @folder-clicked="emit('folderClicked', $event)"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { IContent, IFolderItem } from "@/types/folders";
import { FolderIcon, ChevronUpIcon } from "@heroicons/vue/20/solid";
import { ButtonNormal } from "@lawandorga/components";
import { ref, computed, toRefs } from "vue";
import FoldersBadge from "./FoldersBadge.vue";

const props = withDefaults(
  defineProps<{
    folders: IFolderItem[] | null;
    depth?: number;
  }>(),
  { depth: 0 },
);
const { folders } = toRefs(props);

const open = ref<number[]>([]);

const emit = defineEmits([
  "addChildClicked",
  "addContentClicked",
  "folderClicked",
]);

const chevronClicked = (index: number) => {
  if (!open.value.includes(index)) open.value.push(index);
  else open.value = open.value.filter((i) => i !== index);
};

const properties = computed<{ [key: string]: string }>(() => {
  const ret: { [key: string]: string } = {};
  folders.value?.forEach((i: IFolderItem) => {
    ret[i.folder.uuid] = getFolderProperties(i);
  });
  return ret;
});

const getFolderProperties = (item: IFolderItem): string => {
  const properties: string[] = [];
  if (!item.folder.has_access) {
    properties.push("N");
    return properties.join(", ");
  }
  if (item.folder.stop_inherit) properties.push("IS");
  if (item.content.some((i: IContent) => i.repository === "RECORD"))
    properties.push("R");
  return properties.join(", ");
};
</script>
