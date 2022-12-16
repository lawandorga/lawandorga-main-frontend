<template>
  <ul v-if="folders" class="leading-7">
    <li v-for="item in folders" :key="item.folder.id" class="list-inside">
      <span class="inline-block w-full">
        <div class="flex justify-between">
          <button
            class="flex items-center transition focus:outline-none hover:underline group"
            @click="emit('folderClicked', item.folder.id)"
          >
            <FolderIcon
              class="w-5 h-5 text-gray-500 group-hover:text-gray-600"
            />
            <span class="ml-1.5">{{ item.folder.name }}</span>
          </button>
          <span class="flex space-x-3">
            <ButtonNormal
              kind="action"
              @click="emit('createClicked', item.folder.id)"
            >
              Add Child
            </ButtonNormal>
          </span>
        </div>
      </span>
      <div class="pl-4">
        <ul class="">
          <li v-for="content in item.content" :key="content.name">
            <div class="flex items-center">
              <DocumentTextIcon class="w-5 h-5 text-gray-500" />
              <div class="ml-2">
                {{ content.name }}
              </div>
              <div class="ml-4">
                <ButtonNormal
                  v-if="content.actions['OPEN']"
                  kind="action"
                  :to="content.actions['OPEN']"
                >
                  Open
                </ButtonNormal>
              </div>
            </div>
          </li>
        </ul>
        <FoldersTree
          v-if="item.children.length"
          :folders="item.children"
          @create-clicked="emit('createClicked', $event)"
          @folder-clicked="emit('folderClicked', $event)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { IFolderItem } from "@/types/folders";
import { DocumentTextIcon, FolderIcon } from "@heroicons/vue/20/solid";
import { ButtonNormal } from "@lawandorga/components";

defineProps<{
  folders: IFolderItem[] | null;
}>();

const emit = defineEmits(["createClicked", "folderClicked"]);
</script>
