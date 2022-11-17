<template>
  <BoxLoader :show="userStore.loaded && !!actionsMailUser">
    <div
      v-if="userStore.loaded && !!actionsMailUser"
      class="max-w-3xl mx-auto space-y-6"
    >
      <BreadcrumbsBar :base="{ name: 'mail-dashboard' }" :pages="[]">
        <EnvelopeIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div v-if="actionsMailUser.user" class="mt-10 space-y-10">
        <div v-if="actionsMailUser.user.id">
          E-Mail: {{ actionsMailUser.user.email || "none yet" }}
        </div>
        <div v-else>
          <p>
            You don't have a mail role, yet. Click the button to create one:
          </p>
          <ButtonNormal
            kind="action"
            @click="actionsMailUser.createMailUserRole()"
          >
            Create my mail user role
          </ButtonNormal>
        </div>
      </div>
    </div>
  </BoxLoader>
  <ActionsMailUser ref="actionsMailUser" />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";
import { ButtonNormal } from "@lawandorga/components";

const userStore = useUserStore();

const actionsMailUser = ref<typeof ActionsMailUser>();
</script>
