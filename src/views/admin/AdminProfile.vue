<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="user"
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Profiles', to: { name: 'admin-profiles' } },
          {
            name: user.name,
            to: { name: 'admin-profile', params: { id: user.id } },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="grid grid-cols-2 gap-y-6">
        <div v-if="user" class="bg-white rounded shadow max-w-lg px-6 py-5">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">{{ user.name }}</h2>
            <div class="flex items-center space-x-4">
              <ButtonBlue kind="action" @click="changePasswordModalOpen = true">
                Change Password
              </ButtonBlue>
              <ButtonBlue kind="action" @click="updateModalOpen = true">
                Edit
              </ButtonBlue>
            </div>
          </div>
          <div class="mt-4">
            <p>E-Mail: {{ user.email }}</p>
            <p>Phone: {{ user.phone_number }}</p>
            <div
              v-if="
                ['street', 'city', 'postal_code', 'note'].every((item) =>
                  Object.keys(user).includes(item),
                )
              "
            >
              <p>
                Address:
                <span v-if="user.street && user.postal_code && user.city">
                  {{ user.street }}, {{ user.postal_code }} {{ user.city }}
                </span>
              </p>
              <p>
                Note:
                <br />
                {{ user.note }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-3">
          <TableGenerator
            :head="[
              { name: 'Permission', key: (obj) => obj.permission_object.name },
              {
                name: 'Source',
                key: 'source',
              },
              { name: '', key: 'action' },
            ]"
            :data="permissions"
          >
            <template #head-action>
              <div class="flex justify-end">
                <ButtonNormal
                  size="xs"
                  kind="action"
                  @click="addPermissionModalOpen = true"
                >
                  Add Permission
                </ButtonNormal>
              </div>
            </template>
            <template #source="slotProps">
              <ButtonNormal
                v-if="slotProps.source === 'GROUP'"
                kind="link"
                :to="{
                  name: 'admin-group',
                  params: { id: slotProps.group_object.id },
                }"
              >
                {{ slotProps.group_object.name }}
              </ButtonNormal>
              <template v-else>
                {{ slotProps.user_object.name }}
              </template>
            </template>
            <template #action="slotProps">
              <ButtonNormal
                v-if="slotProps.source === 'USER'"
                kind="delete"
                @click="
                  removePermissionModalOpen = true;
                  permission = slotProps;
                "
              >
                Remove
              </ButtonNormal>
            </template>
          </TableGenerator>
        </div>
      </div>
    </div>
    <!-- user update -->
    <ModalFree v-model="updateModalOpen" title="Update User">
      <FormGenerator
        :fields="userFields"
        :initial="user"
        :request="updateRequest"
      />
    </ModalFree>
    <ModalForm
      v-model="changePasswordModalOpen"
      title="Change Password"
      :request="changePasswordRequest"
      :fields="passwordFields"
    />
    <!-- permission -->
    <ModalFree v-model="addPermissionModalOpen" title="Add Permission">
      <FormGenerator
        :fields="permissionFields"
        :initial="{ user_has_permission: user.user }"
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
import { defineComponent, reactive, watch } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import ButtonBlue from "@/components/ButtonNormal.vue";
import useGet from "@/composables/useGet";
import { ref, Ref } from "vue";
import { ModalFree } from '@lawandorga/components';
import { FormGenerator } from "@lawandorga/components";
import useDeleteItem from "@/composables/useDeleteItem";
import { ModalDelete } from "@lawandorga/components";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";
import useCreateItem from "@/composables/useCreateItem";
import AdminService from "@/services/admin";
import { HasPermission, Permission } from "@/types/core";
import { RlcUser, User } from "@/types/user";
import { useRoute } from "vue-router";
import useUpdateItem from "@/composables/useUpdateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { ModalForm } from "@lawandorga/components";

const userFields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Phone",
    type: "tel",
    name: "phone_number",
    required: false,
  },
  {
    label: "Street",
    type: "text",
    name: "street",
    required: false,
  },
  {
    label: "City",
    type: "text",
    name: "city",
    required: false,
  },
  {
    label: "Postal Code",
    type: "text",
    name: "postal_code",
    required: false,
  },
  {
    label: "Note",
    type: "textarea",
    name: "note",
    required: false,
  },
];

const passwordFields = [
  {
    label: "Current Password",
    type: "password",
    name: "current_password",
    required: true,
  },
  {
    label: "New Password",
    type: "password",
    name: "new_password",
    required: true,
  },
  {
    label: "New Password Confirm",
    type: "password",
    name: "new_password_confirm",
    required: true,
  },
];

export default defineComponent({
  components: {
    BoxLoader,
    ButtonBlue,
    ModalFree,
    TableGenerator,
    ButtonNormal,
    FormGenerator,
    ModalDelete,
    BreadcrumbsBar,
    ModalForm,
    CogIcon,
  },
  setup() {
    const route = useRoute();

    // user
    const user = ref(null) as Ref<RlcUser | null>;
    useGet(AdminService.getUser, user, route.params.id as string);

    // change password
    const {
      updateModalOpen: changePasswordModalOpen,
      updateRequest: changePasswordRequest,
    } = useUpdateItem(AdminService.changePassword, user);

    // update user
    const { updateRequest, updateModalOpen } = useUpdateItem(
      AdminService.updateUser,
      user,
    );

    // permissions
    const permissions = ref(null) as Ref<HasPermission[] | null>;
    useGet(AdminService.getUserPermissions, permissions, user);

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

    return {
      user,
      // update user
      userFields,
      updateRequest,
      updateModalOpen,
      // change password
      passwordFields,
      changePasswordRequest,
      changePasswordModalOpen,
      // permissions
      permissions,
      addPermissionRequest,
      addPermissionModalOpen,
      permissionFields,
      permission,
      removePermissionRequest,
      removePermissionModalOpen,
    };
  },
});
</script>
