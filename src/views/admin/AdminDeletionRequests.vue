<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-xl mx-auto space-y-6">
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
          {{ formatDate(slotProps.created) }}
        </template>
        <template #processed="slotProps">
          {{ formatDate(slotProps.processed) }}
        </template>
        <template #state="slotProps">
          <span v-if="slotProps.state === 're'">Requested</span>
          <span v-if="slotProps.state === 'de'">Declined</span>
          <span v-if="slotProps.state === 'gr'">Accepted</span>
        </template>
        <template #explanation="slotProps">
          <div class="w-40 whitespace-normal line-clamp-3">
            <abbr class="underline-dotted" :title="slotProps.explanation">
              {{ slotProps.explanation }}
            </abbr>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="slotProps.state === 're'"
              size="xs"
              kind="action"
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
      title="Accept / Decline Deletion-Request"
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
import { ModalFree } from '@lawandorga/components';
import { FormGenerator } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import useUpdateItem from "@/composables/useUpdateItem";
import { RecordDeletion } from "@/types/records";
import { formatDate } from "@/utils/date";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { FormField } from "@/types/form";

const fields = [
  {
    label: "Accept or decline",
    name: "state",
    type: "select",
    options: [
      { name: "Accept (Delete Record)", value: "gr" },
      { name: "Decline (Record will not be deleted)", value: "de" },
    ],
    required: true,
  },
] as FormField[];

export default defineComponent({
  components: {
    CogIcon,
    BreadcrumbsBar,
    BoxLoader,
    TableGenerator,
    ButtonNormal,
    ModalFree,
    FormGenerator,
  },
  setup() {
    const deletionRequests = ref(null) as Ref<RecordDeletion[] | null>;

    // get
    useGet(RecordsService.getRecordDeletions, deletionRequests);

    // update
    const {
      updateRequest,
      updateModalOpen,
      temporary: deletionRequest,
    } = useUpdateItem(RecordsService.updateRecordDeletion, deletionRequests);

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
