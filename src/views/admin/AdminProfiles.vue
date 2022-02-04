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
          <ButtonLink
            :to="{
              name: 'admin-profile',
              params: { id: slotProps.dataItem.id },
            }"
          >
            {{ slotProps.dataItem.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="!slotProps.dataItem.accepted"
              size="xs"
              color="lightblue"
              @click="
                profile = slotProps.dataItem;
                acceptUserModalOpen = true;
              "
            >
              Accept
            </ButtonNormal>
            <ButtonNormal
              v-if="slotProps.dataItem.locked"
              size="xs"
              color="lightblue"
              @click="
                profile = slotProps.dataItem;
                unlockUserModalOpen = true;
              "
            >
              Unlock
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              color="lightred"
              @click="
                profile = slotProps.dataItem;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
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
import ButtonNormal from "@/components/ButtonNormal.vue";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import ButtonLink from "@/components/ButtonLink.vue";

export default defineComponent({
  components: {
    ButtonLink,
    BreadcrumbsBar,
    CogIcon,
    BoxLoader,
    TableGenerator,
    ButtonNormal,
    ModalDelete,
  },
  setup() {
    const profiles = ref(null) as Ref<User[] | null>;
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
