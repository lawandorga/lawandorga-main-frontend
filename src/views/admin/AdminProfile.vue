<template>
  <BoxLoader :show="true">
    <div class="grid grid-cols-3 gap-y-6">
      <div v-if="user" class="bg-white rounded shadow max-w-lg px-6 py-5">
        <div class="text-sm font-bold tracking-wide text-gray-500">User</div>
        <h2 class="text-2xl font-bold">{{ user.name }}</h2>
        <div class="mt-4">
          <p>E-Mail: {{ user.email }}</p>
          <p>Phone: {{ user.phone_number }}</p>
        </div>
        <ButtonBlue type="button" @click="updateModalOpen = true">
          Edit
        </ButtonBlue>
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
              <ButtonTable type="button" @click="addPermissionModalOpen = true">
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
import ButtonBlue from "@/components/ButtonBlue.vue";
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
];

export default defineComponent({
  components: {
    BoxLoader,
    ButtonBlue,
    ModalFree,
    TableGenerator,
    ButtonTable,
    FormGenerator,
    ModalDelete,
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
    const permissions = ref([]) as Ref<HasPermission[]>;
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
