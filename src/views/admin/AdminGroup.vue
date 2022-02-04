<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="group"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Groups',
            to: { name: 'admin-groups' },
          },
          {
            name: group.name,
            to: { name: 'admin-group', params: { id: group.id } },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
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
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              color="lightblue"
              @click="addPermissionModalOpen = true"
            >
              Add Permission
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              color="lightred"
              @click="
                removePermissionModalOpen = true;
                permission = slotProps.dataItem;
              "
            >
              Remove
            </ButtonNormal>
          </div>
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
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              color="lightblue"
              @click="addMemberModalOpen = true"
            >
              Add Member
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              color="lightred"
              @click="
                removeMemberModalOpen = true;
                member = slotProps.dataItem;
              "
            >
              Remove
            </ButtonNormal>
          </div>
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
import ButtonNormal from "@/components/ButtonNormal.vue";
import useCreateItem from "@/composables/useCreateItem";
import { watch, defineComponent, ref, Ref, reactive } from "vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";

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
    BreadcrumbsBar,
    BoxLoader,
    TableGenerator,
    ModalFree,
    FormGenerator,
    ButtonNormal,
    CogIcon,
    ModalDelete,
  },
  setup() {
    const route = useRoute();

    // group
    const group = ref(null) as Ref<Group | null>;
    useGetItem(AdminService.getGroup, group, route.params.id as string);

    // const p = ref({}) as Ref<HasPermission>

    // members and permissions
    const members = ref(null) as Ref<User[] | null>;
    const permissions = ref(null) as Ref<HasPermission[] | null>;

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
