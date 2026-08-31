<script setup lang="ts">
import { computed } from "vue";

import { formatDate } from "@/utils/date";

import { useFollowUps } from "../api/useFollowUps";
import LinkListBox, { type BoxLink } from "./LinkListBox.vue";

const { followUps } = useFollowUps();

const links = computed<BoxLink[] | undefined>(() =>
  followUps.value?.map((followUp) => ({
    key: followUp.folder_uuid,
    label: `${followUp.title} - ${formatDate(followUp.time)}`,
    to: {
      name: "folders-detail",
      params: { uuid: followUp.folder_uuid },
      query: { selectedType: "TIMELINE" },
    },
  })),
);
</script>

<template>
  <LinkListBox
    title="Follow Ups"
    :links="links"
    empty-text="No follow-ups found."
  />
</template>
