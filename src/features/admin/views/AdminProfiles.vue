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
          { name: 'Last Login', key: 'last_login_month' },
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
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import UsersDeleteUser from "@/features/admin/actions/OrgUsersDeleteUser.vue";
import UsersActivateDeactivateUser from "@/features/admin/actions/OrgUsersActivateDeactivateUser.vue";
import UsersAcceptUser from "@/features/admin/actions/OrgUsersAcceptUser.vue";
import UsersUnlockUser from "@/features/admin/actions/OrgUsersUnlockUser.vue";
import useClient from "@/api/client";

const profiles = ref(null) as Ref<RlcUserSmall[] | null>;

const client = useClient();
const request = client.get("api/rlc_users/");
const query = useGet(request, profiles);
</script>
