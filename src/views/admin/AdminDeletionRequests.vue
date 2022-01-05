<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Deletion-Requests',
            to: { name: 'admin-recorddeletionrequests' },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Record', key: 'record_detail' },
          { name: 'Requested', key: 'created' },
          { name: 'Requested By', key: 'requested_by_detail' },
          { name: 'Explanation', key: 'explanation' },
          { name: 'Processed', key: 'processed' },
          { name: 'Processed By', key: 'processed_by_detail' },
          { name: 'State', key: 'state' },
          { name: '', key: 'action' },
        ]"
        :data="deletionRequests"
      >
        <template #created="slotProps">
          {{ formatDate(slotProps.dataItem.created) }}
        </template>
        <template #processed="slotProps">
          {{ formatDate(slotProps.dataItem.processed) }}
        </template>
        <template #state="slotProps">
          <span v-if="slotProps.dataItem.state === 're'">Requested</span>
          <span v-if="slotProps.dataItem.state === 'de'">Declined</span>
          <span v-if="slotProps.dataItem.state === 'gr'">Accepted</span>
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
    <ModalFree
      v-model="updateModalOpen"
      title="Accept / Decline Deletion-Request"
    >
      <FormGenerator
        :fields="fields"
        :initial="{
          ...deletionRequest,
          processed_by: $store.getters['user/user'].id,
          processed: new Date(),
        }"
        :request="updateRequest"
      />
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import RecordsService from "@/services/records";
import BoxLoader from "@/components/BoxLoader.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import { RecordDeletion } from "@/types/records";
import { formatDate } from "@/utils/date";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";

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
    CogIcon,
    BreadcrumbsBar,
    BoxLoader,
    TableGenerator,
    ButtonTable,
    ModalFree,
    FormGenerator,
  },
  setup() {
    const deletionRequests = ref(null) as Ref<RecordDeletion[] | null>;
    const deletionRequest = ref(null) as Ref<RecordDeletion | null>;

    // get
    useGetItems(RecordsService.getRecordDeletions, deletionRequests);

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateRecordDeletion,
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
