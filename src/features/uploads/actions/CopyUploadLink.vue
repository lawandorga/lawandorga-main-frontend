<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";

import { useAlertStore } from "@/store/alert";

defineProps<{ link: string }>();

const alertStore = useAlertStore();
const copyLink = (link: string) => {
  navigator.clipboard
    .writeText(link)
    .then(() => alertStore.showSuccess("Link Copied"));
};
</script>

<template>
  <ButtonNormal v-if="link" kind="action" @click="copyLink(link)">
    Copy Link
  </ButtonNormal>
</template>
