<template>
  <!-- member -->
  <ModalCreate
    v-model="addMemberModalOpen"
    title="Add Member"
    :fields="fields"
    :request="addMember"
  />
  <ModalDelete
    v-model="removeMemberModalOpen"
    verb="remove"
    title="Remove Member"
    :request="removeMember"
    :data="memberTemporary"
  />
  <!-- permission -->
  <ModalCreate
    v-model="addPermissionModalOpen"
    title="Add Permission"
    :fields="permissionFields"
    :data="{ group_has_permission: group?.id }"
    :request="addPermissionRequest"
  />
  <ModalDelete
    v-model="removePermissionModalOpen"
    title="Remove Permission"
    verb="remove"
    :request="removePermissionRequest"
    :data="permissionTemporary"
  />
</template>

<script lang="ts" setup>
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";
import { ModalCreate, ModalDelete } from "@lawandorga/components";
import { Ref, ref, toRefs, watch } from "vue";
import AdminService from "@/services/admin";
import { Group, GroupMember, HasPermission, Permission } from "@/types/core";
import { RlcUserSmall } from "@/types/user";
import useGet from "@/composables/useGet";
import useDelete from "@/composables/useDelete";
import useCreate from "@/composables/useCreate";

// props
const props = defineProps<{ id: string }>();
const { id } = toRefs(props);

// group
const group = ref(null) as Ref<Group | null>;
useGet(AdminService.getGroup, group, id);

// permissions
const permissions = ref(null) as Ref<HasPermission[] | null>;
useGet(AdminService.getGroupPermissions, permissions, group);

// add permission
const permissionFields = ref([
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
} = useCreate(AdminService.createHasPermission, permissions);

watch(addPermissionModalOpen, () =>
  AdminService.getPermissions().then(
    (users) => (permissionFields.value[0].options = users),
  ),
);

// remove permission
const {
  temporary: permissionTemporary,
  deleteRequest: removePermissionRequest,
  deleteModalOpen: removePermissionModalOpen,
} = useDelete(AdminService.deleteHasPermission, permissions);

// members
const members = ref(null) as Ref<GroupMember[] | null>;
useGet(AdminService.getMembers, members, group);

// add member
const fields = ref([
  {
    label: "User",
    name: "member",
    type: "combobox",
    required: true,
    options: [] as RlcUserSmall[],
  },
]);

const {
  commandRequest: addMember,
  commandModalOpen: addMemberModalOpen,
  temporary: memberTemporary,
} = useCommand(
  AdminService.addMember,
  group,
  useQuery(AdminService.getMembers, members, group),
);

watch(addMemberModalOpen, (newValue) => {
  if (newValue)
    AdminService.getUsers().then((users) => (fields.value[0].options = users));
});

// remove member
const {
  commandRequest: removeMember,
  commandModalOpen: removeMemberModalOpen,
} = useCommand(
  AdminService.removeMember,
  group,
  useQuery(AdminService.getMembers, members, group),
);

// expose
defineExpose({
  // group
  group,
  // members
  members,
  addMemberModalOpen,
  removeMemberModalOpen,
  memberTemporary,
  // permissions
  permissions,
  permissionTemporary,
  addPermissionModalOpen,
  removePermissionModalOpen,
});
</script>
