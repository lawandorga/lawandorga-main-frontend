<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Grant Access"
      :fields="grantAccessFields"
      :request="commandRequest"
      :data="{ uuid: folderUuid }"
      submit="Grant Access"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersGrantAccess } from "@/services/folders";
import { IAccess } from "@/types/folders";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { computed, toRefs } from "vue";

const props = defineProps<{
  folderUuid: string;
  query: () => void;
  availablePersons?: IAccess[] | undefined;
}>();

const { query, availablePersons } = toRefs(props);

const grantAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "user_uuid",
      type: "select",
      required: true,
      options: availablePersons?.value ? availablePersons.value : [],
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCommand(
  foldersGrantAccess,
  query.value,
);
</script>
