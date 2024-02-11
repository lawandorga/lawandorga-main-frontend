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

      <div class="p-5 prose bg-white rounded shadow max-w-none">
        <p>
          <b>Note:</b>
          Record keys are being replaced by folder keys. Therefore they are
          shown here but will probably have no effect.
        </p>
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
          <DeleteKey
            v-if="slotProps.source === 'RECORD'"
            :key-id="slotProps.id"
            :query="query"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useGet from "@/composables/useGet";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import { useUserStore } from "@/store/user";
import ActionsUserUnlockSelf from "@/features/users/actions/ActionsUserUnlockSelf.vue";
import DeleteKey from "@/features/users/actions/DeleteKey.vue";
import useClient from "@/api/client";
import TestKeys from "@/features/users/actions/TestKeys.vue";

interface Key {
  id: number;
  correct: boolean;
  source: "RECORD" | "RLC";
  information: string;
}

const userStore = useUserStore();

const keys = ref<Key[]>();

const client = useClient();
const request = client.get("api/keys/");
const query = useGet(request, keys);
</script>
