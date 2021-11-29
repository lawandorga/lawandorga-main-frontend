<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Permission-Requests',
            to: { name: 'admin-recordpermitrequests' },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
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
    <ModalFree
      v-model="updateModalOpen"
      title="Accept / Decline Permission-Request"
    >
      <FormGenerator
        :fields="fields"
        :initial="deletionRequest"
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
import { RecordDeletionRequest } from "@/types/records";
import { formatDate } from "@/utils/date";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";

const fields = [
  {
    label: "Accept or decline",
    name: "state",
    type: "select",
    options: [
      { name: "Accept (Allow access to record)", id: "gr" },
      { name: "Decline (No access will be grantend)", id: "de" },
    ],
    required: true,
  },
];

export default defineComponent({
  components: {
    CogIcon,
    BoxLoader,
    TableGenerator,
    ButtonTable,
    BreadcrumbsBar,
    ModalFree,
    FormGenerator,
  },
  setup() {
    const deletionRequests = ref([]) as Ref<RecordDeletionRequest[]>;
    const deletionRequest = ref(null) as Ref<RecordDeletionRequest | null>;

    // get
    useGetItems(RecordsService.getPermissionRequests, deletionRequests);

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updatePermissionRequest,
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
