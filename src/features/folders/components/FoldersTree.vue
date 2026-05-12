<script setup lang="ts">
import { FolderIcon, ChevronUpIcon } from "@heroicons/vue/20/solid";
import { ButtonNormal } from "lorga-ui";
import { ref, toRefs } from "vue";
import { useRoute } from "vue-router";

import { useFolderProperties } from "@/composables/useFolderProperties";
import { useUserStore } from "@/store/user";

import { FolderItem } from "../api/useFolderPage";
import FoldersBadge from "./FoldersBadge.vue";

const props = withDefaults(
  defineProps<{
    folders: FolderItem[] | null;
    depth?: number;
    openFolders?: string[];
  }>(),
  { depth: 0, openFolders: () => [] },
);
const { folders, openFolders } = toRefs(props);

const emit = defineEmits([
  "addChildClicked",
  "addContentClicked",
  "showMetaClicked",
  "folderClicked",
]);

const route = useRoute();
const userStore = useUserStore();

const queryOpen =
  !Array.isArray(route.query.open) && route.query.open ? route.query.open : "";

const openedFolders: string[] = queryOpen.includes(",")
  ? queryOpen.split(",")
  : [];

const open = ref<string[]>(
  openedFolders
    .concat(openFolders.value)
    .concat(userStore.getSetting<string[]>("openFolders", []) as string[]),
);

const openOrCloseFolder = (uuid: string) => {
  if (!open.value.includes(uuid)) openFolder(uuid);
  else closeFolder(uuid);
};

const openFolder = (uuid: string) => {
  open.value.push(uuid);
  userStore.updateSetting("openFolders", open.value);
};

const closeFolder = (uuid: string) => {
  open.value = open.value.filter((i) => i !== uuid);
  userStore.updateSetting("openFolders", open.value);
};

const { properties } = useFolderProperties(folders);
</script>

<template>
  <template v-for="item in folders" :key="item.folder.uuid">
    <div
      class="flex h-7 w-full rounded-sm leading-snug odd:bg-white even:bg-gray-100"
      :style="{ paddingLeft: `${depth * 18}px` }"
    >
      <button
        class="focus-visible:ring-opacity-75 w-5 rounded-lg text-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-gray-500"
        @click="openOrCloseFolder(item.folder.uuid)"
      >
        <ChevronUpIcon
          :class="
            open.includes(item.folder.uuid)
              ? 'rotate-180 transform'
              : 'rotate-90'
          "
          class="h-5 w-5 text-gray-500"
        />
      </button>
      <div class="flex items-center">
        <FolderIcon
          class="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-600"
        />
        <span class="mr-3 ml-1.5 truncate">{{ item.folder.name }}</span>
        <div
          v-if="properties[item.folder.uuid]"
          class="rounded px-1 py-0 text-xs leading-tight font-medium tracking-wide whitespace-nowrap text-gray-800 uppercase shadow ring-1 ring-gray-700"
        >
          {{ properties[item.folder.uuid] }}
        </div>
        <div class="ml-3">
          <ButtonNormal
            v-if="item.folder.actions.includes('OPEN')"
            kind="action"
            :to="{
              name: 'folders-detail',
              params: { uuid: item.folder.uuid },
            }"
          >
            Open
          </ButtonNormal>
        </div>
      </div>
      <div class="ml-auto flex items-center space-x-3 pr-2 whitespace-nowrap">
        <ButtonNormal
          kind="action"
          @click="emit('showMetaClicked', item.folder.uuid)"
        >
          Show Meta
        </ButtonNormal>
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
          Add Subfolder
        </ButtonNormal>
      </div>
    </div>
    <template v-if="open.includes(item.folder.uuid)">
      <div
        v-for="content in item.content.filter(
          (item) => item.repository !== 'RECORDS_RECORD',
        )"
        :key="content.name"
        class="odd:bg-white even:bg-gray-100"
      >
        <div class="flex items-center">
          <div :style="{ width: `${(depth + 1) * 18}px` }"></div>
          <div class="block h-5 w-5"></div>
          <FoldersBadge :text="content.repository" />
          <div class="ml-2 text-sm leading-normal">
            {{ content.name }}
          </div>
          <div class="ml-3">
            <ButtonNormal
              v-if="item.folder.actions.includes('OPEN')"
              kind="action"
              :to="{
                name: 'folders-detail',
                params: { uuid: item.folder.uuid },
                query: {
                  selectedId: content.uuid,
                  selectedType: content.repository,
                },
              }"
            >
              Open
            </ButtonNormal>
          </div>
        </div>
      </div>
      <FoldersTree
        v-if="item.children.length"
        :depth="depth + 1"
        :folders="item.children"
        :open-folders="open"
        @show-meta-clicked="emit('showMetaClicked', $event)"
        @add-child-clicked="emit('addChildClicked', $event)"
        @add-content-clicked="emit('addContentClicked', $event)"
        @folder-clicked="emit('folderClicked', $event)"
      />
    </template>
  </template>
</template>
