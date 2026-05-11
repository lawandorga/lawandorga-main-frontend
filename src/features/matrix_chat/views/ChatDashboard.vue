<script setup lang="ts">
import { CircleLoader } from "lorga-ui";
import { ref } from "vue";

import BoxLoader from "@/components/BoxLoader.vue";
import useGet2 from "@/composables/useGet2";
import ChatCreateMatrixUser from "@/features/matrix_chat/actions/CreateMatrixUser.vue";
import { useUserStore } from "@/store/user";

interface ChatPage {
  matrix_user: null | { _group: string; matrix_id: string };
}

const userStore = useUserStore();

const page = ref<ChatPage>();

const query = useGet2("api/auth/query/page/chat/", page);
</script>

<template>
  <BoxLoader :show="userStore.loaded">
    <div class="rounded bg-white px-6 py-5 shadow">
      <div class="prose prose-h1:text-2xl">
        <template v-if="page && !page.matrix_user">
          <h1>Opt-in for the Law&Orga Matrix Chat</h1>
          <p>
            Law&Orga has a chat system now built on Matrix. It is end to end
            encrypted and only you and the person you text has access to your
            messages.
          </p>
          <p>
            The chat system is still in Beta, because of the UI, which is based
            on Element. However, technically everything works.
          </p>
          <p>
            The process to use it is Opt-in. You can click the following button
            in order to create a chat role.
          </p>
          <ChatCreateMatrixUser :query="query" />
        </template>
        <template v-else-if="page && page.matrix_user">
          <h1>Law&Orga Chat</h1>
          <p>
            You can access the Law&Orga Chat on
            <a href="https://chat.law-orga.de" target="_blank" rel="noopener">
              chat.law-orga.de
            </a>
            <span>.</span>
          </p>
        </template>
        <template v-else>
          <CircleLoader />
        </template>
      </div>
    </div>
  </BoxLoader>
</template>
