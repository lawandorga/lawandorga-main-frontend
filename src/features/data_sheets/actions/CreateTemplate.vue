<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { useRouter } from "vue-router";

import useCmd from "@/composables/useCmd";

const { commandRequest, commandModalOpen } = useCmd();

const createFields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
];

const router = useRouter();

const createAndRedirect = async (data: Record<string, unknown>) => {
  const result = await commandRequest(data);
  await router.push({
    name: "admin-template",
    params: { id: result.id.toString() },
  });
};
</script>

<template>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    Create Template
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Template"
      :fields="createFields"
      :request="createAndRedirect"
      :data="{
        action: 'data_sheets/create_template',
      }"
    />
  </ButtonNormal>
</template>
