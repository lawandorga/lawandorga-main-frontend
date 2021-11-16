<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto">
      <TableGenerator
        :head="[
          { name: 'Record', key: ['record', 'record_token'] },
          { name: 'Requested', key: 'requested' },
          { name: 'State', key: 'state' },
          { name: 'Processed', key: 'processed_on' },
          { name: '', key: 'action' },
        ]"
        :data="deletionRequests"
      >
        <template #requested="slotProps">
          {{ formatDate(slotProps.dataItem.requested) }}
        </template>
        <template #state="slotProps">
          <span v-if="slotProps.dataItem.state === 're'">Requested</span>
          <span v-if="slotProps.dataItem.state === 'de'">Declined</span>
          <span v-if="slotProps.dataItem.state === 'gr'">Accepted</span>
        </template>
        <template #processed="slotProps">
          {{ formatDate(slotProps.dataItem.requested) }}
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              v-if="slotProps.dataItem.state === 're'"
              type="button"
              @click="
                deletionRequest = slotProps.dataItem;
                updateModalOpen = true;
              "
            >
              Accept or Decline
            </ButtonTable>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Questionnaire">
      <FormGenerator
        :fields="fields"
        :initial="deletionRequest"
        :request="updateRequest"
      />
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import RecordsService from "@/services/records";
import BoxLoader from "@/components/BoxLoader.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import { RecordDeletionRequest } from "@/types/records";
import { formatDate } from "@/utils/date";

const fields = [
  {
    label: "Accept or decline",
    name: "state",
    type: "select",
    options: [
      { name: "Accept (Delete Record)", id: "gr" },
      { name: "Decline (Record will not be deleted)", id: "de" },
    ],
    required: true,
  },
];

export default defineComponent({
  components: {
    BoxLoader,
    TableGenerator,
    ButtonTable,
    ModalFree,
    FormGenerator,
  },
  setup() {
    const deletionRequests = ref([]) as Ref<RecordDeletionRequest[]>;
    const deletionRequest = ref(null) as Ref<RecordDeletionRequest | null>;

    // get
    useGetItems(RecordsService.getDeletionRequests, deletionRequests);

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateDeletionRequest,
      deletionRequests,
    );

    return {
      deletionRequests,
      deletionRequest,
      // update
      fields,
      updateRequest,
      updateModalOpen,
      // data
      formatDate,
    };
  },
});
</script>
