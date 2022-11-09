<template>
  <ul v-if="folders">
    <li
      v-for="[folder, children] in folders"
      :key="folder.name"
      class="list-disc list-inside"
    >
      <span>
        <span class="inline-block w-32">
          {{ folder.name }}
        </span>
        <ButtonNormal kind="action" @click="emit('createClicked', folder.id)">
          Create
        </ButtonNormal>
        <ButtonNormal kind="delete" @click="emit('deleteClicked', folder.id)">
          Delete
        </ButtonNormal>
      </span>
      <div class="pl-8">
        <FoldersTree v-if="children.length" :children="children" />
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
