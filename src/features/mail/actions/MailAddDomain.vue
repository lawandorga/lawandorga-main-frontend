<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add A Domain
    <ModalCreate
      v-model="commandModalOpen"
      title="Add a domain"
      submit="Add"
      :fields="fields"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailAddDomain } from "@/services/mail";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();

const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Domain",
    name: "name",
    type: "text",
    required: true,
    helptext: "For example: example.law-orga.de",
  },
];

const { commandModalOpen, commandRequest } = useCommand(
  mailAddDomain,
  query.value,
);
</script>
