<template>
  <BoxLoader :show="true">
    <div class="grid gap-6">
      <div v-if="group" class="bg-white shadow rounded px-5 py-4">
        <h2 class="text-lg font-bold mb-4">
          {{ group.name }}
        </h2>
        <div>
          <p>{{ group.description }}</p>
        </div>
      </div>

      <TableGenerator
        :head="[
          { name: 'Permission', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="permissions"
      >
        <template #head-action>
          <ButtonTable type="button" @click="addPermissionModalOpen = true">
            Add Permission
          </ButtonTable>
        </template>
        <template #action="slotProps">
          <ButtonTable
            type="button"
            @click="
              removePermissionModalOpen = true;
              permission = slotProps.dataItem;
            "
          >
            Remove
          </ButtonTable>
        </template>
      </TableGenerator>

      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'E-Mail', key: 'email' },
          { name: '', key: 'action' },
        ]"
        :data="members"
      >
        <template #head-action>
          <ButtonTable type="button" @click="addMemberModalOpen = true">
            Add Member
          </ButtonTable>
        </template>
        <template #action="slotProps">
          <ButtonTable
            type="button"
            @click="
              removeMemberModalOpen = true;
              member = slotProps.dataItem;
            "
          >
            Remove
          </ButtonTable>
        </template>
      </TableGenerator>
    </div>
    <!-- member -->
    <ModalFree v-model="addMemberModalOpen" title="Add Member">
      <FormGenerator :fields="memberFields" :request="addMemberRequest" />
    </ModalFree>
    <ModalDelete
      v-model="removeMemberModalOpen"
      verb="remove"
      title="Remove Member"
      :request="removeMemberRequest"
      :object="member"
    />
    <!-- permission -->
    <ModalFree v-model="addPermissionModalOpen" title="Add Permission">
      <FormGenerator
        :fields="permissionFields"
        :initial="{ group_has_permission: group.id }"
        :request="addPermissionRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="removePermissionModalOpen"
      title="Remove Permission"
      verb="remove"
      :request="removePermissionRequest"
      :object="permission"
    />
  </BoxLoader>
</template>

<script lang="ts">
import useGetItem from "@/composables/useGetItem";
import useGetItems from "@/composables/useGetItems";
import { Group, HasPermission, Permission } from "@/types/core";
import AdminService from "@/services/admin";
import { useRoute } from "vue-router";
import { User } from "@/types/user";
import BoxLoader from "@/components/BoxLoader.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import useCreateItem from "@/composables/useCreateItem";
import { watch, defineComponent, ref, Ref, reactive } from "vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";

const groupFields = [
  {
    label: "Name",
    type: "text",
    tag: "input",
    name: "name",
    required: true,
  },
  {
    label: "Description",
    tag: "textarea",
    name: "description",
    required: false,
  },
];

export default defineComponent({
  components: {
    BoxLoader,
    TableGenerator,
    ModalFree,
    FormGenerator,
    ButtonTable,
    ModalDelete,
  },
  setup() {
    const route = useRoute();

    // group
    const group = ref(null) as Ref<Group | null>;
    useGetItem(AdminService.getGroup, group, route.params.id as string);

    // const p = ref({}) as Ref<HasPermission>

    // members and permissions
    const members = ref([]) as Ref<User[]>;
    const permissions = ref([]) as Ref<HasPermission[]>;

    // watch(group, (group) => {
    useGetItems(AdminService.getMembers, members, group);
    useGetItems(AdminService.getGroupPermissions, permissions, group);
    // });

    // add permission
    const permissionFields = reactive([
      {
        label: "Permission",
        name: "permission",
        type: "select",
        required: true,
        options: [] as Permission[],
      },
    ]);

    const {
      createRequest: addPermissionRequest,
      createModalOpen: addPermissionModalOpen,
    } = useCreateItem(AdminService.createHasPermission, permissions);

    watch(addPermissionModalOpen, () =>
      AdminService.getPermissions().then(
        (users) => (permissionFields[0].options = users),
      ),
    );

    // remove permission
    const permission = ref(null) as Ref<User | null>;

    const {
      deleteRequest: removePermissionRequest,
      deleteModalOpen: removePermissionModalOpen,
    } = useDeleteItem(AdminService.deleteHasPermission, permissions);

    // add member
    const memberFields = reactive([
      {
        label: "User",
        name: "user",
        type: "select",
        required: true,
        options: [] as User[],
      },
    ]);

    const {
      createRequest: addMemberRequest,
      createModalOpen: addMemberModalOpen,
    } = useCreateItem(AdminService.addMember, members, group);

    watch(addMemberModalOpen, () =>
      AdminService.getUsers().then(
        (users) => (memberFields[0].options = users),
      ),
    );

    // remove member
    const member = ref(null) as Ref<User | null>;

    const {
      deleteRequest: removeMemberRequest,
      deleteModalOpen: removeMemberModalOpen,
    } = useDeleteItem(AdminService.removeMember, members, group);

    return {
      permissions,
      addPermissionRequest,
      addPermissionModalOpen,
      permissionFields,
      permission,
      removePermissionRequest,
      removePermissionModalOpen,
      // members
      members,
      addMemberRequest,
      addMemberModalOpen,
      memberFields,
      member,
      removeMemberRequest,
      removeMemberModalOpen,
      // group
      group,
      groupFields,
    };
  },
});
</script>
