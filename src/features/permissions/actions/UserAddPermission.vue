<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Permission
    <ModalCreate
      v-model="commandModalOpen"
      title="Add Permission"
      :fields="permissionFields"
      :data="{ user_id: userId }"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalCreate, ButtonNormal, types } from "@lawandorga/components";
import { computed, toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import { usePermissions } from "@/composables/usePermissions";

const props = defineProps<{ query: () => void; userId: number }>();
const { query, userId } = toRefs(props);

const { permissions } = usePermissions();

const permissionFields = computed<types.FormField[]>(() => [
  {
    label: "Permission",
    name: "permission_id",
    type: "select",
    required: true,
    options: permissions.value,
  },
]);

const client = useClient();
const request = client.post("api/permissions/has_permissions/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
