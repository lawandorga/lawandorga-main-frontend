<template>
  <ModalDelete
    v-model="deleteModalOpen"
    :object="{
      id: folder?.id,
      user_slug: temporary?.slug,
    }"
    :request="deleteRequest"
    title="Revoke access"
  >
    Are you sure you want to revoke this access?
  </ModalDelete>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { ModalDelete } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import { foldersRevokeAccess } from "@/services/folders";
import { IAccess, IFolder } from "@/types/folders";

// props
const props = defineProps<{ folder: IFolder | null; query: () => void }>();
const { query } = toRefs(props);

// delete
const temporary = ref<null | IAccess>(null);
const { commandRequest: deleteRequest, commandModalOpen: deleteModalOpen } =
  useCommand(foldersRevokeAccess, query.value);

// expose
defineExpose({
  temporary,
  deleteModalOpen,
});
</script>
