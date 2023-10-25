<template>
  <template v-if="record">
    <BoxHeadingStats
      :show="selectedType === 'RECORD'"
      :title="record.name"
      :stats="[
        `Created: ${formatDate(record.created)}`,
        `Template: ${record.template_name}`,
      ]"
    >
      <FormRecord :record="record" :query="recordsQuery"></FormRecord>
      <template #buttons>
        <RecordsChangeName
          :id="record.id"
          :query="allQuery"
          :name="record.name"
        />
      </template>
    </BoxHeadingStats>

    <BoxHeadingStats
      class="mt-5"
      title="Client"
      :show="selectedType === 'RECORD' && !!record.client"
      :stats="[' ']"
    >
      <p class="mb-5 text-sm text-gray-600">
        The following data could not be copied over into the new format, due to
        the way the encryption was built.
      </p>
      <p>Client name: {{ record.client?.name }}</p>
      <p>Client phone: {{ record.client?.phone }}</p>
      <p>Client note: {{ record.client?.note }}</p>
    </BoxHeadingStats>
  </template>
  <CircleLoader v-else-if="selectedType === 'RECORD' && selectedId !== null" />
</template>

<script lang="ts" setup>
import RecordsChangeName from "@/actions/RecordsChangeName.vue";
import { formatDate } from "@/utils/date";
import { ref, toRefs, watch } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FormRecord from "./FormRecord.vue";
import { Record } from "@/types/records";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "lorga-ui";
import useClient from "@/api/client";

// props
const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
}>();
const { selectedId, selectedType, query } = toRefs(props);

// record
const client = useClient();
const request = client.get("api/data_sheets/query/{}/", selectedId);
const record = ref<Record | null>(null);
const recordsQuery = useQuery(request, record);

const update = () => {
  if (record.value && selectedId.value !== record.value.uuid)
    record.value = null;
  if (selectedType.value === "RECORD" && selectedId.value) {
    recordsQuery();
  }
};
watch(selectedId, () => {
  update();
});
update();

// query
const allQuery = () => {
  query.value();
  recordsQuery();
};
</script>
