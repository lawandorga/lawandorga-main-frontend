<template>
  <BoxLoader show>
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
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <UsersAcceptUser
            :query="query"
            :user-name="slotProps.name"
            :user-id="slotProps.id"
            :user-accepted="slotProps.accepted"
          />
          <UsersUnlockUser
            :query="query"
            :user-name="slotProps.name"
            :user-id="slotProps.id"
            :user-locked="slotProps.locked"
          />
          <UsersActivateDeactivateUser
            :query="query"
            :user-name="slotProps.name"
            :user-id="slotProps.id"
            :user-active="slotProps.is_active"
          />
          <UsersDeleteUser
            :query="query"
            :user-name="slotProps.name"
            :user-id="slotProps.id"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { RlcUserSmall } from "@/types/user";
import useGet from "@/composables/useGet";
import AdminService from "@/services/admin";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "@lawandorga/components";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import UsersDeleteUser from "@/actions/OrgUsersDeleteUser.vue";
import UsersActivateDeactivateUser from "@/actions/OrgUsersActivateDeactivateUser.vue";
import UsersAcceptUser from "@/actions/OrgUsersAcceptUser.vue";
import UsersUnlockUser from "@/actions/OrgUsersUnlockUser.vue";

const profiles = ref(null) as Ref<RlcUserSmall[] | null>;
const query = useGet(AdminService.getUsers, profiles);
</script>
