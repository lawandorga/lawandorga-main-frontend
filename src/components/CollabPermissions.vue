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
      collab section. Those permissions can be managed within the admin section.
    </p>
    <TableGenerator
      :head="[
        { name: 'User', key: ['user_has_permission', 'name'] },
        { name: 'Group', key: ['group_has_permission', 'name'] },
        { name: 'Permission', key: ['permission', 'name'] },
      ]"
      :data="permissions"
    ></TableGenerator>
  </ModalFree>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ModalFree from "@/components/ModalFree.vue";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import CollabService from "@/services/collab";
import TableGenerator from "@/components/TableGenerator.vue";
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
