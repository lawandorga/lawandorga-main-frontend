<template>
  <ButtonNormal kind="action" @click="createModalOpen = true">
    Create Group
    <ModalCreate
      v-model="createModalOpen"
      :request="createRequest"
      :fields="fields"
      title="Create Group"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailCreateGroup } from "@/services/mail";
import { IAvailableMailDomain } from "@/types/mail";
import { ModalCreate, types, ButtonNormal } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  availableDomains: IAvailableMailDomain[];
}>();
const { availableDomains, query } = toRefs(props);

const fields = computed<types.FormField[]>(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain",
      type: "select",
      required: true,
      options: availableDomains.value as types.FormField["options"],
    },
  ] as types.FormField[];
});
const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(mailCreateGroup, query.value);
</script>
