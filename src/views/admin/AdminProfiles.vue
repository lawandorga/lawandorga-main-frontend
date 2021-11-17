<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Profiles', to: { name: 'admin-profiles' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
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
            :to="{
              name: 'admin-profile',
              params: { id: slotProps.dataItem.id },
            }"
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
                unlockUserModalOpen = true;
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
    </div>
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
import { defineComponent } from "vue";
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
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: {
    BreadcrumbsBar,
    CogIcon,
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
