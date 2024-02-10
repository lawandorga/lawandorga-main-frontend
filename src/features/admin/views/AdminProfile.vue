<template>
  <BoxLoader :show="!!data">
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
              />
            </div>
          </div>
          <div class="mt-4">
            <p v-if="user.email">E-Mail: {{ user.email }}</p>
            <p v-if="user.phone_number">Phone: {{ user.phone_number }}</p>
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
              <p v-if="user.note">
                Note:
                <br />
                {{ user.note }}
              </p>
            </div>
            <p v-if="user.speciality_of_study_display">
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

<script lang="ts" setup>
import { ref, computed } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import useGet from "@/composables/useGet";
import { TableGenerator, ButtonNormal } from "lorga-ui";
import { RlcUser } from "@/types/user";
import { useRoute } from "vue-router";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import UsersChangePassword from "@/features/admin/actions/UsersChangePassword.vue";
import UserAddPermission from "@/features/permissions/actions/UserAddPermission.vue";
import RemovePermission from "@/features/permissions/actions/RemovePermission.vue";
import useClient from "@/api/client";
import UserUpdateInformation from "@/features/users/actions/UserUpdateInformation.vue";

interface HasPermission {
  id: number;
  permission_name: string;
  source: string;
  group_name: string;
  user_name: string;
  group_id: number;
}

interface IData {
  user: RlcUser;
  permissions: HasPermission[] | null;
}

const route = useRoute();
const userStore = useUserStore();

const data = ref<IData | null>(null);

const user = computed<RlcUser | null>(() => {
  if (!data.value) return null;
  return data.value.user;
});

const permissions = computed<HasPermission[] | null>(() => {
  if (!data.value) return null;
  return data.value.permissions;
});

const client = useClient();
const request = client.get("/api/rlc_users/{}/", route.params.id as string);
const query = useGet(request, data);
</script>
