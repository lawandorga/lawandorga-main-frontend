<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import UsersDeleteUser from "@/features/admin/actions/DeleteUser.vue";
import UsersActivateDeactivateUser from "@/features/admin/actions/ActivateDeactivateUser.vue";
import UsersAcceptUser from "@/features/admin/actions/AcceptOrgUser.vue";
import UsersUnlockUser from "@/features/admin/actions/UnlockUser.vue";
import { useProfiles } from "../api/useProfiles";

const { profiles, query } = useProfiles();
</script>

<template>
  <BoxLoader show>
    <div class="max-w-(--breakpoint-xl) mx-auto space-y-6">
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
          { name: 'Groups', fn: (i) => i.group_names.join(', ') },
          { name: 'Last Login', key: 'last_login_month' },
          { name: '', key: 'action' },
        ]"
        :data="profiles"
      >
        <template #name="{ i }">
          <div class="flex items-center space-x-1">
            <ButtonLink
              :to="{
                name: 'admin-profile',
                params: { id: i.id },
              }"
            >
              <span class="whitespace-nowrap">
                {{ i.name }}
              </span>
            </ButtonLink>
            <template v-for="q in i.qualifications" :key="q">
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full"
              >
                {{ q }}
              </span>
            </template>
          </div>
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
