<template>
  <template v-if="collab">
    <BoxHeadingStats
      :show="selectedType === 'COLLAB'"
      :title="collab.name"
      :stats="[`Created: ${formatDate(collab.created_at)}`]"
    >
      <CollabForm
        :text="collab.text"
        :collab-uuid="collab.uuid"
        :password="collab.password"
      />
      <template #buttons>
        <CollabPrint />
        <CollabShowHistory :history="collab.history" />
        <CollabChangeName
          :uuid="collab.uuid"
          :query="allQuery"
          :name="collab.name"
        />
      </template>
    </BoxHeadingStats>
  </template>
  <CircleLoader v-else-if="selectedType === 'COLLAB' && selectedId !== null" />
</template>

<script lang="ts" setup>
import { formatDate } from "@/utils/date";
import { ref, toRefs, watch } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "lorga-ui";
import useClient from "@/api/client";
import CollabChangeName from "../actions/CollabChangeName.vue";
import CollabForm from "./CollabForm.vue";
import CollabShowHistory from "../actions/CollabShowHistory.vue";
import CollabPrint from "../actions/CollabPrint.vue";

export interface IHistory {
  user: string;
  time: string;
  text: string;
}

interface Collab {
  uuid: string;
  name: string;
  text: string;
  created_at: string;
  password: string;
  history: IHistory[];
}

const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
}>();
const { selectedId, selectedType, query } = toRefs(props);

const client = useClient();
const request = client.get("api/collab/query/{}/", selectedId);
const collab = ref<Collab>();
const collabQuery = useQuery(request, collab);

const update = () => {
  if (collab.value && selectedId.value !== collab.value.uuid)
    collab.value = undefined;
  if (selectedType.value === "COLLAB" && selectedId.value) {
    collabQuery();
  }
};
watch(selectedId, update, { immediate: true });

const allQuery = () => {
  query.value();
  collabQuery();
};
</script>
