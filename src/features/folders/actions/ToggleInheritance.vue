<script setup lang="ts">
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  folderName: string;
  folderInheritanceStopped: boolean;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    <template v-if="folderInheritanceStopped">Allow Access From Above</template>
    <template v-else>Cut Access From Above</template>
    <ModalConfirm
      v-model="commandModalOpen"
      :title="
        folderInheritanceStopped
          ? 'Allow Access From Above'
          : 'Cut Access From Above'
      "
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        action: 'folders/toggle_inheritance_folder',
      }"
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
