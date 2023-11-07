<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Grant Access"
      :fields="grantAccessFields"
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        action: 'folders/grant_access_to_user',
      }"
      submit="Grant Access"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { IAccess } from "@/types/folders";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
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
      name: "to_uuid",
      type: "select",
      required: true,
      options: availablePersons?.value ? availablePersons.value : [],
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
