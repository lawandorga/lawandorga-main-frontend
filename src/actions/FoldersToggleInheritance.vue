<template>
  <ButtonNormal kind="action" @click="toggleInheritanceModalOpen = true">
    Toggle inheritance
    <ModalConfirm
      v-model="toggleInheritanceModalOpen"
      title="Toggle Inheritance"
      :request="toggleInheritanceRequest"
      :data="{ folder: folderUuid }"
      submit="Toggle"
    >
      Are you sure you want to toggle the inheritance of '{{ folderName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersToggleInheritance } from "@/services/folders";
import { ModalConfirm } from "@lawandorga/components";
import { toRefs } from "vue";
import { ButtonNormal } from "@lawandorga/components";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  folderName: string;
}>();

const { query } = toRefs(props);

const {
  commandRequest: toggleInheritanceRequest,
  commandModalOpen: toggleInheritanceModalOpen,
} = useCommand(foldersToggleInheritance, query.value);
</script>
