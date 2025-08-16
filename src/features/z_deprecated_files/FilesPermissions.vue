<template>
  <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
    Show General Permissions
  </ButtonBreadcrumbs>
  <ModalFree
    v-model="generalPermissionsModalOpen"
    width="max-w-(--breakpoint-xl)"
    title="General Permission"
  >
    <p class="mb-10 text-gray-600">
      Groups or users listed here have permissions that apply to the whole Files
      section. Those permissions can be managed within the admin section.
    </p>
    <TableGenerator
      :head="[
        { name: 'User', key: (obj) => obj.user_name },
        { name: 'Group', key: (obj) => obj.group_name },
        { name: 'Permission', key: (obj) => obj.permission_name },
      ]"
      :data="permissions"
    ></TableGenerator>
  </ModalFree>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { ModalFree, TableGenerator } from "lorga-ui";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

export interface HasPermission {
  id: number;
  permission: number;
  user_has_permission: number;
  group_has_permission: number;
  group_object: { name: string; id: number };
  permission_object: { name: string; id: number };
  user_object: { name: string; id: number };
}

const generalPermissionsModalOpen = ref(false);
const permissions = ref<HasPermission[] | null>(null);

const request = useClient().get("api/permissions/query/has_permissions/files/");
const query = useQuery(request, permissions);

watch(generalPermissionsModalOpen, (newValue) => {
  if (newValue === true && permissions.value === null) query();
});
</script>
