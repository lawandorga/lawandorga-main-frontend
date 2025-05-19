<script lang="ts" setup>
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  permissionId: number;
  permissionName: string;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Remove
    <ModalDelete
      v-model="commandModalOpen"
      title="Remove Permission"
      verb="remove"
      :request="commandRequest"
      :data="{
        action: 'permissions/delete_has_permission',
        has_permission_id: permissionId,
      }"
      :obj-name="permissionName"
    />
  </ButtonNormal>
</template>
