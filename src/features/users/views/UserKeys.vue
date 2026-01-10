<script lang="ts" setup>
import { ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import ActionsUserUnlockSelf from "@/features/users/actions/UnlockSelf.vue";
import TestKeys from "@/features/users/actions/TestKeys.vue";
import GroupsRemoveMember from "@/features/org/actions/RemoveMemberFromGroup.vue";
import useGet2 from "@/composables/useGet2";

interface Key {
  id: number;
  correct: boolean;
  source: "RECORD" | "RLC" | "GROUP";
  information: string;
  group_id: number | null;
}

const userStore = useUserStore();

const keys = ref<Key[]>();

const query = useGet2("api/auth/keys/", keys);
</script>

<template>
  <BoxLoader :show="userStore.loaded" class="pb-64">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Profiles', to: { name: 'admin-profiles' } },
          {
            name: userStore.user?.name || '',
            to: {
              name: 'admin-profile',
              params: { id: userStore.user?.id.toString() || '0' },
            },
          },
          { name: 'Keys', to: { name: 'user-keys' } },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div
        v-if="userStore.user?.locked"
        class="max-w-lg px-6 py-5 bg-white rounded shadow"
      >
        <div class="prose">
          <h2 class="mb-2 text-xl font-bold text-gray-800">
            Your account is locked
          </h2>
          <p>
            The reason that your account is locked is because you have keys that
            are not correct. This means you have keys that are unable to decrypt
            records, files or collab documents.
          </p>
          <p>There are two solutions to only have correct keys:</p>
          <ol>
            <li>
              Other users in your LC can go to Admin > Profiles and press the
              unlock button next to your account. This will try to correct as
              many of your keys as possible. After this, you need to test all
              keys.
            </li>
            <li>
              You can delete keys that do not work and request access again for
              your lost records.
            </li>
          </ol>
          <p>Once all your keys are correct you can unlock yourself.</p>
        </div>
        <ActionsUserUnlockSelf />
      </div>
      <TableGenerator
        :head="[
          { name: 'Information', key: 'information' },
          { name: 'Type', key: 'source' },
          { name: 'Correct', fn: (x) => x.correct, key: 'correct' },
          { name: '', key: 'action' },
        ]"
        :data="keys"
      >
        <template #head-action>
          <TestKeys :query="query" />
        </template>
        <template #correct="{ v }">
          <div
            :class="{ 'bg-green-500': v, 'bg-red-500': !v }"
            class="w-5 h-5 rounded-full"
          ></div>
        </template>
        <template #action="slotProps">
          <GroupsRemoveMember
            v-if="
              slotProps.source === 'GROUP' &&
              userStore.user &&
              slotProps.group_id
            "
            title="Delete Key"
            button="Delete"
            :member-name="userStore.user.name"
            :member-id="userStore.user.id"
            :group-id="slotProps.group_id"
            :key-id="slotProps.id"
            :query="query"
          >
            Are you sure you want to delete this group key?
          </GroupsRemoveMember>
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
