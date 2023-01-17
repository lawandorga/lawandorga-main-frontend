<template>
  <ButtonNormal v-if="link" kind="action" @click="copyLink(link)">
    Copy Link
  </ButtonNormal>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/store/alert";
import { ButtonNormal } from "@lawandorga/components";

defineProps<{ link: string }>();

const alertStore = useAlertStore();
const copyLink = (link: string) => {
  navigator.clipboard
    .writeText(link)
    .then(() => alertStore.showSuccess("Link Copied"));
};
</script>
