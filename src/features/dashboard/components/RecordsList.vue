<script setup lang="ts">
import { computed } from "vue";

import { useRecords } from "../api/useRecords";
import LinkListBox, { type BoxLink } from "./LinkListBox.vue";

const { records } = useRecords();

const links = computed<BoxLink[] | undefined>(() =>
  records.value?.map((sheet) => ({
    key: sheet.uuid,
    label: `${sheet.identifier} (${sheet.state})`,
    to: {
      name: "folders-detail",
      params: { uuid: sheet.folder_uuid },
      query: { selectedType: "RECORD", selectedId: sheet.uuid },
    },
  })),
);
</script>

<template>
  <LinkListBox
    title="Active Data Sheets"
    :links="links"
    empty-text="No active data sheets."
  />
</template>
