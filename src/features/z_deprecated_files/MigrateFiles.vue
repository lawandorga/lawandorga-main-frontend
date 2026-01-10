<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";
import { ButtonNormal, ModalConfirm } from "lorga-ui";

const { commandModalOpen, commandRequest } = useCmd();

const store = useUserStore();
</script>

<template>
  <ButtonNormal
    v-if="store.user?.email === 'dummy@law-orga.de'"
    kind="secondary"
    @click="commandModalOpen = true"
  >
    Migrate Files
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Migrate Files"
    :request="commandRequest"
    submit="Migrate"
    :data="{
      action: 'files/migrate_old_files',
    }"
  >
    This will migrate all your files into the new folders system.
  </ModalConfirm>
</template>
