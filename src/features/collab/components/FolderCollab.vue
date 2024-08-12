<template>
  <template v-if="collab">
    <BoxHeadingStats
      :show="selectedType === 'COLLAB'"
      :title="collab.name"
      :stats="[`Created: ${formatDate(collab.created_at)}`]"
    >
      <template #buttons>
        <DownloadPdf :uuid="collab.uuid" :name="collab.name" />
        <CollabShowHistory :history="collab.history" />
        <CollabChangeName
          :uuid="collab.uuid"
          :query="allQuery"
          :name="collab.name"
        />
      </template>
      <CollabForm
        :text="collab.text"
        :collab-uuid="collab.uuid"
        :password="collab.password"
      />
      <template v-if="!!collab.template">
        <div class="flex items-center mt-6">
          <CheckIcon class="w-6 h-6" />
          <span class="ml-4 font-semibold text-formcolor">
            Template
            <i class="font-bold">{{ collab.template.name }}</i>
            applied
          </span>
        </div>
        <div class="flex gap-4">
          <CollabEditTemplate
            :query="collabQuery"
            :uuid="collab.uuid"
            :selected-template="collab.template"
          />
          <CollabRemoveTemplate :query="collabQuery" :uuid="collab.uuid" />
        </div>
      </template>
      <CollabAddTemplate v-else :query="collabQuery" :uuid="collab.uuid" />
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
import { CheckIcon } from "@heroicons/vue/24/outline";
import useClient from "@/api/client";
import CollabChangeName from "../actions/CollabChangeName.vue";
import CollabForm from "./CollabForm.vue";
import CollabShowHistory from "../actions/CollabShowHistory.vue";
import CollabAddTemplate from "../actions/CollabAddTemplate.vue";
import DownloadPdf from "../actions/DownloadPdf.vue";
import { CollabTemplate } from "@/features/admin/api/useTemplate";
import CollabEditTemplate from "../actions/CollabEditTemplate.vue";
import CollabRemoveTemplate from "../actions/CollabRemoveTemplate.vue";

export interface History {
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
  history: History[];
  template: CollabTemplate | null;
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
