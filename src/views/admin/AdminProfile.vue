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
            <div>
              <div class="text-sm font-bold tracking-wide text-gray-500">
                User
              </div>
              <h2 class="text-2xl font-bold">{{ user.name }}</h2>
            </div>
            <div>
              <ButtonBlue type="button" @click="updateModalOpen = true">
                <div class="flex space-x-1 items-center">
                  <PencilIcon class="w-5 h-5 opacity-90" />
                  <span class="">Edit</span>
                </div>
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
              { name: 'Permission', key: 'name' },
              { name: '', key: 'action' },
            ]"
            :data="permissions"
          >
            <template #head-action>
              <div class="flex justify-end">
                <ButtonTable
                  type="button"
                  @click="addPermissionModalOpen = true"
                >
                  Add Permission
                </ButtonTable>
              </div>
            </template>
            <template #action="slotProps">
              <div class="flex justify-end">
                <ButtonTable
                  type="button"
                  @click="
                    removePermissionModalOpen = true;
                    permission = slotProps.dataItem;
                  "
                >
                  Remove
                </ButtonTable>
              </div>
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
import useGetItem from "@/composables/useGetItem";
import { ref, Ref } from "vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import useCreateItem from "@/composables/useCreateItem";
import AdminService from "@/services/admin";
import useGetItems from "@/composables/useGetItems";
import { HasPermission, Permission } from "@/types/core";
import { User } from "@/types/user";
import { useRoute } from "vue-router";
import useUpdateItem from "@/composables/useUpdateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { PencilIcon } from "@heroicons/vue/solid";

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

export default defineComponent({
  components: {
    BoxLoader,
    ButtonBlue,
    ModalFree,
    TableGenerator,
    ButtonTable,
    PencilIcon,
    FormGenerator,
    ModalDelete,
    BreadcrumbsBar,
    CogIcon,
  },
  setup() {
    const route = useRoute();

    // user
    const user = ref(null) as Ref<User | null>;
    useGetItem(AdminService.getUser, user, route.params.id as string);

    // update user
    const { updateRequest, updateModalOpen } = useUpdateItem(
      AdminService.updateUser,
      user,
    );

    // permissions
    const permissions = ref(null) as Ref<HasPermission[] | null>;
    useGetItems(AdminService.getUserPermissions, permissions, user);

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

<style></style>
