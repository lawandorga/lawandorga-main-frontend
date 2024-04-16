<template>
  <ButtonNormal kind="action" @click="createModalOpen = true">
    Create Group
    <ModalCreate
      v-model="createModalOpen"
      :request="createRequest"
      :fields="fields"
      title="Create Group"
      :data="{
        action: 'mail/create_group',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { AvailableMailDomain } from "@/types/mail";
import { ModalCreate, types, ButtonNormal } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  availableDomains: AvailableMailDomain[];
}>();
const { availableDomains, query } = toRefs(props);

const fields = computed<types.FormField[]>(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain_uuid",
      type: "select",
      required: true,
      options: availableDomains.value,
    },
  ] as types.FormField[];
});
const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCmd(query.value);
</script>
