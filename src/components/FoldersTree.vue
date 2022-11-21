<template>
  <ul v-if="folders" class="">
    <li v-for="item in folders" :key="item.folder.id" class="list-inside">
      <span class="inline-block w-full">
        <div class="flex justify-between">
          <button
            class="focus:outline-none hover:underline tranistion"
            @click="emit('folderClicked', item.folder.id)"
          >
            {{ item.folder.name }}
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
import { ButtonNormal } from "@lawandorga/components";

defineProps<{
  folders: IFolderItem[] | null;
}>();

const emit = defineEmits(["createClicked", "folderClicked"]);
</script>
