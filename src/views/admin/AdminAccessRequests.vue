<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Access-Requests',
            to: { name: 'admin-recordpermitrequests' },
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
          { name: 'Processed', key: 'processed_on' },
          { name: 'Processed By', key: 'processed_by_detail' },
          { name: 'State', key: 'state' },
          { name: '', key: 'action' },
        ]"
        :data="deletionRequests"
      >
        <template #created="slotProps">
          {{ formatDate(slotProps.created) }}
        </template>
        <template #processed_on="slotProps">
          {{ formatDate(slotProps.processed_on) }}
        </template>
        <template #state="slotProps">
          <span v-if="slotProps.state === 're'">Requested</span>
          <span v-if="slotProps.state === 'de'">Declined</span>
          <span v-if="slotProps.state === 'gr'">Accepted</span>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="slotProps.state === 're'"
              kind="action"
              size="xs"
              @click="
                deletionRequest = slotProps;
                updateModalOpen = true;
              "
            >
              Accept or Decline
            </ButtonNormal>
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
import ButtonNormal from "@/components/ButtonNormal.vue";
import ModalFree from "@/components/ModalFree.vue";
import { FormGenerator } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import useUpdateItem from "@/composables/useUpdateItem";
import { RecordAccess } from "@/types/records";
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
    ButtonNormal,
    BreadcrumbsBar,
    ModalFree,
    FormGenerator,
  },
  setup() {
    const deletionRequests = ref(null) as Ref<RecordAccess[] | null>;
    const deletionRequest = ref(null) as Ref<RecordAccess | null>;

    // get
    useGet(RecordsService.getRecordAccesses, deletionRequests);

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateRecordAccess,
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
