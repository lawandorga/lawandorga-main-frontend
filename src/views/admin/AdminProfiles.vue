<template>
  <BoxLoader :show="true">
    <TableGenerator
      :head="[
        { name: 'Name', key: 'name' },
        { name: 'E-Mail', key: 'email' },
        { name: 'Phone', key: 'phone_number' },
        { name: '', key: 'action' },
      ]"
      :data="profiles"
    >
      <template #name="slotProps">
        <router-link
          class="underline"
          :to="{ name: 'admin-profile', params: { id: slotProps.dataItem.id } }"
        >
          {{ slotProps.dataItem.name }}
        </router-link>
      </template>
      <template #action="slotProps">
        <div class="flex justify-end space-x-3">
          <ButtonTable
            v-if="!slotProps.dataItem.accepted"
            type="button"
            @click="
              profile = slotProps.dataItem;
              acceptUserModalOpen = true;
            "
          >
            Accept
          </ButtonTable>
          <ButtonTable
            v-if="slotProps.dataItem.locked"
            type="button"
            @click="
              profile = slotProps.dataItem;
              unlockUserModalOpen;
            "
          >
            Unlock
          </ButtonTable>
          <ButtonTable
            type="button"
            @click="
              profile = slotProps.dataItem;
              deleteModalOpen = true;
            "
          >
            Delete
          </ButtonTable>
        </div>
      </template>
    </TableGenerator>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="profile"
    />
    <!-- accept -->
    <ModalDelete
      v-model="acceptUserModalOpen"
      title="Accept User"
      :request="acceptUserRequest"
      :object="profile"
      verb="accept"
    />
    <!-- unlock -->
    <ModalDelete
      v-model="unlockUserModalOpen"
      title="Unlock User"
      :request="unlockUserRequest"
      :object="profile"
      verb="unlock"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref, Ref } from "vue";
import { User } from "@/types/user";
import useGetItems from "@/composables/useGetItems";
import AdminService from "@/services/admin";
import BoxLoader from "@/components/BoxLoader.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";

export default defineComponent({
  components: {
    BoxLoader,
    TableGenerator,
    ButtonTable,
    ModalDelete,
  },
  setup() {
    const profiles = ref([]) as Ref<User[]>;
    useGetItems(AdminService.getUsers, profiles);

    // accept
    const {
      updateRequest: acceptUserRequest,
      updateModalOpen: acceptUserModalOpen,
    } = useUpdateItem(AdminService.acceptUser, profiles);

    // delete
    const profile = ref(null) as Ref<User | null>;
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      AdminService.deleteUser,
      profiles,
    );

    // unlock
    const {
      updateRequest: unlockUserRequest,
      updateModalOpen: unlockUserModalOpen,
    } = useUpdateItem(AdminService.unlockUser, profiles);

    return {
      profiles,
      profile,
      // delete
      deleteRequest,
      deleteModalOpen,
      // accept
      acceptUserRequest,
      acceptUserModalOpen,
      // unlock
      unlockUserRequest,
      unlockUserModalOpen,
    };
  },
});
</script>
