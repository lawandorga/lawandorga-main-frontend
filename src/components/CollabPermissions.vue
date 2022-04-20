<template>
  <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
    Show General Permissions
  </ButtonBreadcrumbs>
  <ModalFree
    v-model="generalPermissionsModalOpen"
    width="max-w-screen-xl"
    title="General Permission"
  >
    <p class="mb-10 text-gray-600">
      Groups or users listed here have permissions that apply to the whole
      Collab section. Those permissions can be managed within the admin section.
    </p>
    <TableGenerator
      :head="[
        { name: 'User', key: (obj) => obj.user_object?.name },
        { name: 'Group', key: (obj) => obj.group_object?.name },
        { name: 'Permission', key: (obj) => obj.permission_object.name },
      ]"
      :data="permissions"
    ></TableGenerator>
  </ModalFree>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ModalFree } from '@lawandorga/components';
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import CollabService from "@/services/collab";
import { TableGenerator } from "@lawandorga/components";
import { HasPermission } from "@/types/core";

export default defineComponent({
  components: {
    ButtonBreadcrumbs,
    ModalFree,
    TableGenerator,
  },
  data() {
    return {
      generalPermissionsModalOpen: false,
      permissions: null as HasPermission[] | null,
    };
  },
  watch: {
    generalPermissionsModalOpen(newValue) {
      if (newValue === true && this.permissions === null)
        CollabService.getGeneralPermissions().then(
          (permissions) => (this.permissions = permissions),
        );
    },
  },
});
</script>
