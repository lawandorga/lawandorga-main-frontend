<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, ref, toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);
const { commandRequest, commandModalOpen } = useCmd(query.value);

const uuid = ref(uuidv4());
const router = useRouter();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    Create Template
    <ModalForm
      v-model="commandModalOpen"
      title="Create Template"
      :fields="fields"
      :request="
        async (props: any) => {
          await commandRequest(props);
          router.push({
            path: `/admin/collab/template/${uuid}`,
          });
        }
      "
      submit="Create"
      :data="{ action: 'collab/create_template', uuid: uuid }"
    />
  </ButtonNormal>
</template>
