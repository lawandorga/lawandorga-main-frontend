<script lang="ts" setup>
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useCmd from "@/composables/useCmd";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  linkUuid: string;
  query: () => void;
}>();

const router = useRouter();
const route = useRoute();

const queryAndRedirect = () => {
  props.query();
  router.push({
    name: "folders-detail",
    params: { uuid: route.params.uuid },
    query: {
      selectedType: "UPLOAD",
    },
  });
};

const { commandModalOpen, commandRequest } = useCmd(queryAndRedirect);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete Link
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Link"
      :request="commandRequest"
      :data="{ link_uuid: linkUuid, action: 'upload/delete_link' }"
      submit="Delete"
    >
      Are you sure you want to delete this link? All uploaded files will be
      permanently deleted and this action can not be undone.
    </ModalDelete>
  </ButtonNormal>
</template>
