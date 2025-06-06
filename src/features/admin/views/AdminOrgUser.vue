<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator, ButtonNormal } from "lorga-ui";
import { useRoute } from "vue-router";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import UsersChangePassword from "@/features/admin/actions/ChangePassword.vue";
import UserAddPermission from "@/features/permissions/actions/AddPermissionToUser.vue";
import RemovePermission from "@/features/permissions/actions/RemovePermission.vue";
import UserUpdateInformation from "@/features/users/actions/UpdateUserInformation.vue";
import { useProfileData } from "../api/useProfileData";

const route = useRoute();
const userStore = useUserStore();

const { query, permissions, user } = useProfileData(route.params.id as string);
</script>

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
              <UsersChangePassword :query="query" :user-id="user.id" />
              <UserUpdateInformation
                :query="query"
                :user-id="user.id"
                :user-name="user.name"
                :user-phone-number="user.phone_number"
                :user-street="user.street"
                :user-city="user.city"
                :user-postal-code="user.postal_code"
                :user-speciality-of-study="user.speciality_of_study"
                :user-note="user.note"
                :user-qualifications="user.qualifications"
              />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-semibold">Contact & Address</h3>
            <p v-if="user.email" class="text-sm">
              <span class="font-medium">E-Mail:</span>
              {{ user.email }}
            </p>
            <p v-if="user.phone_number" class="text-sm">
              <span class="font-medium">Phone:</span>
              {{ user.phone_number }}
            </p>
            <div
              v-if="
                ['street', 'city', 'postal_code', 'note'].every((item) =>
                  Object.keys(user || {}).includes(item),
                )
              "
              class="space-y-2 text-sm"
            >
              <p>
                <span class="font-medium">Address:{{ " " }}</span>
                <span v-if="user.street && user.postal_code && user.city">
                  {{ user.street }}, {{ user.postal_code }} {{ user.city }}
                </span>
              </p>
            </div>
            <h3 class="block mt-4 text-lg font-semibold">
              Additional Information
            </h3>
            <p v-if="user.speciality_of_study_display" class="text-sm">
              <span class="font-medium">Speciality of Study:</span>
              {{ user.speciality_of_study_display }}
            </p>
            <p v-if="user.qualifications" class="text-sm">
              <span class="font-medium">Qualifications:</span>
              {{ user.qualifications.join(", ") }}
            </p>
            <div v-if="user.note" class="flex space-x-1 text-sm">
              <span class="font-medium">Note:</span>
              <p>
                {{ user.note }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="userStore.hasPermission('admin__manage_permissions')"
          class="col-span-3"
        >
          <TableGenerator
            :head="[
              { name: 'Permission', key: (obj) => obj.permission_name },
              {
                name: 'Source',
                key: 'source',
              },
              { name: '', key: 'action' },
            ]"
            :data="permissions"
          >
            <template #head-action>
              <UserAddPermission :query="query" :user-id="user.id" />
            </template>
            <template #source="slotProps">
              <ButtonNormal
                v-if="slotProps.source === 'GROUP'"
                kind="link"
                :to="{
                  name: 'admin-group',
                  params: { id: slotProps.group_id },
                }"
              >
                {{ slotProps.group_name }}
              </ButtonNormal>
              <template v-else>
                {{ slotProps.user_name }}
              </template>
            </template>
            <template #action="slotProps">
              <RemovePermission
                v-if="slotProps.source === 'USER'"
                :query="query"
                :permission-id="slotProps.id"
                :permission-name="slotProps.permission_name"
              />
            </template>
          </TableGenerator>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>
