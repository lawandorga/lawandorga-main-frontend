<script setup lang="ts">
import { computed } from "vue";

import { formatDate } from "@/utils/date";

import { useChangedRecords } from "../api/useChangedRecords";
import LinkListBox, { type BoxLink } from "./LinkListBox.vue";

const { changedRecords } = useChangedRecords();

const links = computed<BoxLink[] | undefined>(() =>
  changedRecords.value?.map((record) => ({
    key: record.uuid,
    label: `${record.identifier} (${formatDate(record.updated)})`,
    to: { name: "folders-detail", params: { uuid: record.folder_uuid } },
  })),
);
</script>

<template>
  <LinkListBox
    title="Records updated in the last 10 days"
    :links="links"
    empty-text="No changed records found."
  />
</template>
