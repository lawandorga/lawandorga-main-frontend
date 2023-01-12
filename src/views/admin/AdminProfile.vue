<template>
  <BoxLoader :show="!!user">
    <div v-if="user" class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Profiles', to: { name: 'admin-profiles' } },
          {
            name: user.name,
            to: { name: 'admin-profile', params: { id: user.id.toString() } },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="grid grid-cols-2 gap-y-6">
        <div v-if="user" class="max-w-lg px-6 py-5 bg-white rounded shadow">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">{{ user.name }}</h2>
            <div class="flex items-center space-x-4">
              <ButtonNormal
                kind="action"
                @click="changePasswordModalOpen = true"
              >
                Change Password
              </ButtonNormal>
              <ButtonNormal kind="action" @click="updateModalOpen = true">
                Edit
              </ButtonNormal>
            </div>
          </div>
          <div class="mt-4">
            <p>E-Mail: {{ user.email }}</p>
            <p>Phone: {{ user.phone_number }}</p>
            <div
              v-if="
                ['street', 'city', 'postal_code', 'note'].every((item) =>
                  Object.keys(user || {}).includes(item),
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
            <p>
              Speciality of Study:
              {{ user.speciality_of_study_display }}
            </p>
          </div>
        </div>

        <div
          v-if="userStore.hasPermission('admin__manage_permissions')"
          class="col-span-3"
        >
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
        :data="user"
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
        :data="{ user_has_permission: user?.user_id }"
        :request="addPermissionRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="removePermissionModalOpen"
      title="Remove Permission"
      verb="remove"
      :request="removePermissionRequest"
      :data="permission"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, ref, Ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";
import {
  FormGenerator,
  ModalDelete,
  ModalFree,
  TableGenerator,
  ModalForm,
  ButtonNormal,
} from "@lawandorga/components";
import useDelete from "@/composables/useDelete";
import useCommand from "@/composables/useCommand";
import AdminService from "@/services/admin";
import UserService from "@/services/user";
import { HasPermission, Permission } from "@/types/core";
import { RlcUser, User } from "@/types/user";
import { useRoute } from "vue-router";
import useUpdate from "@/composables/useUpdate";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";

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
    label: "Speciality of Study",
    type: "select",
    name: "speciality_of_study",
    options: [
      { value: "", name: "------" },
      { value: "LAW", name: "Law Sciences" },
      { value: "PSYCH", name: "Psychology" },
      { value: "POL", name: "Political Science" },
      { value: "SOC", name: "Social Sciences" },
      { value: "ECO", name: "Economics" },
      { value: "MED", name: "Medicine / Medical Psychology" },
      { value: "PHA", name: "Pharmacy" },
      { value: "CUL", name: "Cultural Studies" },
      { value: "OTHER", name: "Other" },
      { value: "NONE", name: "None" },
    ],
    required: true,
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
    ButtonNormal,
    ModalFree,
    TableGenerator,
    FormGenerator,
    ModalDelete,
    BreadcrumbsBar,
    ModalForm,
    CogIcon,
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();

    // user
    const user = ref(null) as Ref<RlcUser | null>;
    useGet(AdminService.getUser, user, route.params.id as string);

    // change password
    const {
      updateModalOpen: changePasswordModalOpen,
      updateRequest: changePasswordRequest,
    } = useUpdate(AdminService.changePassword, user);

    // update user
    const { updateRequest, updateModalOpen } = useUpdate(
      AdminService.updateUser,
      user,
    );

    // permissions
    const permissions = ref(null) as Ref<HasPermission[] | null>;
    const getPermissions = useQuery(
      AdminService.getUserPermissions,
      permissions,
      user,
    );
    watch(user, () => {
      if (userStore.hasPermission("admin__manage_permissions"))
        getPermissions();
    });

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
      commandRequest: addPermissionRequest,
      commandModalOpen: addPermissionModalOpen,
    } = useCommand(
      UserService.grantPermission,
      useQuery(AdminService.getUserPermissions, permissions, user),
      user,
    );

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
    } = useDelete(AdminService.deleteHasPermission, permissions);

    return {
      user,
      userStore,
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
