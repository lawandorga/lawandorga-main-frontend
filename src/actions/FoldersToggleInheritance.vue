<template>
  <ButtonNormal kind="action" @click="toggleInheritanceModalOpen = true">
    <template v-if="folderInheritanceStopped">Allow Access From Above</template>
    <template v-else>Cut Access From Above</template>
    <ModalConfirm
      v-model="toggleInheritanceModalOpen"
      :title="
        folderInheritanceStopped
          ? 'Allow Access From Above'
          : 'Cut Access From Above'
      "
      :request="toggleInheritanceRequest"
      :data="{ folder: folderUuid }"
      :submit="folderInheritanceStopped ? 'Allow' : 'Cut'"
    >
      <template v-if="folderInheritanceStopped">
        Are you sure you want to allow access from above to '{{ folderName }}'?
      </template>
      <template v-else>
        Are you sure you want to cut access from above to '{{ folderName }}'?
      </template>
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
  folderInheritanceStopped: boolean;
}>();

const { query } = toRefs(props);

const {
  commandRequest: toggleInheritanceRequest,
  commandModalOpen: toggleInheritanceModalOpen,
} = useCommand(foldersToggleInheritance, query.value);
</script>
