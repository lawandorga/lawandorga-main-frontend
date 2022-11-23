<template>
  <ul v-if="folders" class="leading-7">
    <li v-for="item in folders" :key="item.folder.id" class="list-inside">
      <span class="inline-block w-full">
        <div class="flex justify-between">
          <div class="flex items-center">
            <FolderIcon class="w-5 h-5 text-gray-500" />
            <button
              class="ml-1.5 focus:outline-none hover:underline tranistion"
              @click="emit('folderClicked', item.folder.id)"
            >
              {{ item.folder.name }}
            </button>
          </div>
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
