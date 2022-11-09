<template>
  <BoxLoader :show="userStore.loaded && !!foldersActions">
    <div
      v-if="userStore.loaded && !!foldersActions"
      class="mx-auto space-y-6 max-w-screen-2xl"
    >
      <BreadcrumbsBar :base="{ name: 'folders-dashboard' }" :pages="[]">
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div>
        <ButtonNormal
          @click="
            parent = null;
            foldersActions.createModalOpen = true;
          "
        >
          Create
        </ButtonNormal>
        <FoldersTree
          :folders="foldersActions.folders"
          @create-clicked="
            parent = $event;
            foldersActions.createModalOpen = true;
          "
        />
      </div>
    </div>
  </BoxLoader>
  <ActionsFolders ref="foldersActions" :parent="parent" />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { FolderIcon } from "@heroicons/vue/24/outline";
import ActionsFolders from "@/components/ActionsFolders.vue";
import { ref } from "vue";
import { ButtonNormal } from "@lawandorga/components";
import FoldersTree from "@/components/FoldersTree.vue";

const userStore = useUserStore();
const foldersActions = ref<typeof ActionsFolders>();

const parent = ref<string | null>(null);
</script>
