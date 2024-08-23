<template>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    Add A Domain
    <ModalCreate
      v-model="commandModalOpen"
      title="Add a domain"
      submit="Add"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'mail/add_domain',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();

const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Domain",
    name: "domain",
    type: "text",
    required: true,
    helptext: "For example: example.law-orga.de",
  },
];

const { commandModalOpen, commandRequest } = useCmd(query.value);
</script>
