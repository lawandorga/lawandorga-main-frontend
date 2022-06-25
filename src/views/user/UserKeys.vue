<template>
  <BoxLoader :show="true" class="pb-64">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="$store.getters['user/user']"
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Profiles', to: { name: 'admin-profiles' } },
          {
            name: $store.getters['user/user'].name,
            to: {
              name: 'admin-profile',
              params: { id: $store.getters['user/user'].id },
            },
          },
          { name: 'Keys', to: { name: 'user-keys' } },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Information', key: 'information' },
          { name: 'Type', key: 'source' },
          { name: 'Correct', key: 'correct' },
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
          <ButtonNormal
            size="xs"
            kind="action"
            @click="confirmModalOpen = true"
          >
            Test all keys
          </ButtonNormal>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="slotProps.source === 'RECORD'"
              size="xs"
              kind="delete"
              @click="
                temporary = slotProps;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
      <div
        v-if="$store.getters['user/user'].locked"
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
              keys, as it might not update the correct field.
            </li>
            <li>
              You can delete keys that do not work and request access again for
              your lost records.
            </li>
          </ol>
          <p>Once all your keys are correct you can unlock yourself.</p>
        </div>
        <ButtonNormal
          class="mt-4"
          kind="action"
          @click="unlockModalOpen = true"
        >
          Unlock myself
        </ButtonNormal>
      </div>
    </div>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="temporary"
    />
    <!-- test -->
    <ModalConfirm
      v-model="confirmModalOpen"
      title="Test Keys"
      :request="testKeysRequest"
    >
      Are you sure you want to test all keys? This might take up to a minute.
    </ModalConfirm>
    <!-- unlock -->
    <ModalConfirm
      v-model="unlockModalOpen"
      title="Unlock"
      :request="unlockRequest"
    >
      If the unlock request completes successfully this modal will close and you
      will be able to do everything again.
    </ModalConfirm>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useGet from "@/composables/useGet";
import UserService from "@/services/user";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "@lawandorga/components";
import { ButtonNormal } from "@lawandorga/components";
import useDeleteItem from "@/composables/useDeleteItem";
import { ModalDelete, ModalConfirm } from "@lawandorga/components";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import { Key } from "@/types/key";
import { useStore } from "vuex";

const keys = ref(null) as Ref<Key[] | null>;
useGet(UserService.getKeys, keys);

// test
const confirmModalOpen = ref(false);
const testKeysRequest = () => {
  return UserService.testKeys().then((newKeys) => {
    keys.value = newKeys;
    confirmModalOpen.value = false;
  });
};

// delete
const { deleteRequest, deleteModalOpen, temporary } = useDeleteItem(
  UserService.deleteKey,
  keys,
);

// unlock
const store = useStore();
const unlockModalOpen = ref(false);
const unlockRequest = () => {
  return UserService.unlockSelf().then((rlcUser) => {
    store.dispatch("user/setUser", rlcUser);
    unlockModalOpen.value = false;
  });
};
</script>
