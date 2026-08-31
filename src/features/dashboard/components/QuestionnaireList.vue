<script setup lang="ts">
import { computed } from "vue";

import { useQuestionnaires } from "../api/useQuestionnaires";
import LinkListBox, { type BoxLink } from "./LinkListBox.vue";

const { questionnaires } = useQuestionnaires();

const links = computed<BoxLink[] | undefined>(() =>
  questionnaires.value?.map((questionnaire) => ({
    key: questionnaire.name,
    label: questionnaire.name,
    to: {
      name: "folders-detail",
      params: { uuid: questionnaire.folder_uuid },
    },
  })),
);
</script>

<template>
  <LinkListBox
    title="Questionnaires"
    :links="links"
    empty-text="No questionnaires found."
  />
</template>
