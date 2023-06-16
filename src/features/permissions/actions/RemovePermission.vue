<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Remove
    <ModalDelete
      v-model="commandModalOpen"
      title="Remove Permission"
      verb="remove"
      :request="commandRequest"
      :data="{ name: permissionName }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalDelete, ButtonNormal } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  permissionId: number;
  permissionName: string;
}>();

const { query, permissionId } = toRefs(props);

const client = useClient();
const request = client.delete(
  "api/permissions/has_permissions/{}/",
  permissionId,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
