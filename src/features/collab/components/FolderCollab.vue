<template>
  <template v-if="collab">
    <BoxHeadingStats
      :show="selectedType === 'COLLAB'"
      :title="collab.name"
      :stats="[`Created: ${formatDate(collab.created_at)}`]"
    >
      <template #buttons>
        <DownloadPdf
          v-if="store.user?.email === 'dummy@law-orga.de'"
          :uuid="collab.uuid"
          :name="collab.name"
        />
        <CollabPrint />
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
      <CollabAddTemplate
        v-if="store.user?.email === 'dummy@law-orga.de'"
        :query="collabQuery"
        :uuid="collab.uuid"
        :selected-letterhead="collab.letterhead"
        :selected-footer="collab.footer"
      />
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
import CollabAddTemplate from "../actions/CollabAddTemplate.vue";
import { useUserStore } from "@/store/user";
import DownloadPdf from "../actions/DownloadPdf.vue";
import { Letterhead } from "@/features/admin/api/useLetterhead";
import { Footer } from "@/features/admin/api/useFooter";

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
  letterhead: Letterhead | null;
  footer: Footer | null;
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

const store = useUserStore();
</script>
