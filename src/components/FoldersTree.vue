<template>
  <ul v-if="folders" class="">
    <li v-for="item in folders" :key="item.folder.id" class="list-inside">
      <span class="inline-block w-full">
        <div class="flex justify-between">
          <span class="">
            {{ item.folder.name }}
          </span>
          <span class="flex space-x-3">
            <ButtonNormal
              kind="action"
              @click="emit('createClicked', item.folder.id)"
            >
              Add Child
            </ButtonNormal>
            <ButtonNormal
              kind="delete"
              @click="emit('deleteClicked', item.folder.id)"
            >
              Delete
            </ButtonNormal>
          </span>
        </div>
      </span>
      <div class="pl-4">
        <FoldersTree
          v-if="item.children.length"
          :folders="item.children"
          @delete-clicked="emit('deleteClicked', $event)"
          @create-clicked="emit('createClicked', $event)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { IFolderTree } from "@/types/folders";
import { ButtonNormal } from "@lawandorga/components";

defineProps<{
  folders: IFolderTree[] | null;
}>();

const emit = defineEmits(["createClicked", "deleteClicked"]);
</script>
