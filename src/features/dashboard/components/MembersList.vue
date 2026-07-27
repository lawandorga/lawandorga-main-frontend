<script setup lang="ts">
import { computed } from "vue";

import { useMembers } from "../api/useMembers";
import LinkListBox, { type BoxLink } from "./LinkListBox.vue";

const { members } = useMembers();

const links = computed<BoxLink[] | undefined>(() =>
  members.value?.map((member) => ({
    key: member.id,
    label: member.name,
    to: { name: "admin-profile", params: { id: member.rlcuserid } },
  })),
);
</script>

<template>
  <LinkListBox
    title="New Members in no groups"
    :links="links"
    empty-text="No new members without groups."
  />
</template>
