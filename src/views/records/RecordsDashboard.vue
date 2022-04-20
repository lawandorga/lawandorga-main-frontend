<template>
  <BoxLoader :show="$store.getters['user/loaded']">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <CollectionIcon class="w-6 h-6" />
        <template #buttons>
          <RecordsPermissions />
          <ButtonBreadcrumbs
            v-if="$store.getters['user/rlc'].use_record_pool"
            :to="{ name: 'records-pool' }"
          >
            Go to the Record Pool
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <TableRecords :records="records">
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal kind="action" @click="createModalOpen = true">
              Create Record
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              v-if="!slotProps.record.access"
              size="xs"
              kind="action"
              @click="requestAccess(slotProps.record)"
            >
              Request Access
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              :disabled="slotProps.record.delete"
              @click="
                record = slotProps.record;
                createDeletionRequestModalOpen = true;
              "
            >
              Request Deletion
            </ButtonNormal>
          </div>
        </template>
      </TableRecords>
    </div>
    <!-- modals -->
    <ModalFree v-model="createModalOpen" title="Create Record">
      <FormGenerator
        :fields="createFields"
        :request="createRequest"
        @success="recordCreated($event)"
      ></FormGenerator>
    </ModalFree>
    <ModalFree
      v-model="createDeletionRequestModalOpen"
      title="Request Deletion"
    >
      <FormGenerator
        :fields="[
          {
            label: 'Explanation',
            name: 'explanation',
            type: 'textarea',
            required: true,
          },
        ]"
        :initial="{
          record: record ? record.id : null,
        }"
        :request="createDeletionRequestRequest"
        submit="Request Deletion"
        @success="deletionRequestCreated"
      ></FormGenerator>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import TableRecords from "@/components/TableRecords.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent, ref, Ref, watch } from "vue";
import RecordsService from "@/services/records";
import { RecordDeletion, RecordTemplate, Record } from "@/types/records";
import ButtonNormal from "@/components/ButtonNormal.vue";
import ModalFree from "@/components/ModalFree.vue";
import { FormGenerator } from "@lawandorga/components";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CollectionIcon } from "@heroicons/vue/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { formatDate } from "@/utils/date";
import useCreateItem from "@/composables/useCreateItem";
import useGet from "@/composables/useGet";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { FormField } from "@/types/form";

export default defineComponent({
  components: {
    RecordsPermissions,
    ButtonBreadcrumbs,
    CollectionIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableRecords,
    ButtonNormal,
    ModalFree,
  },
  setup() {
    // store
    const store = useStore();

    // records
    const records = ref(null) as Ref<Record[] | null>;
    const record = ref(null) as Ref<Record | null>;
    useGet(RecordsService.getRecords, records);

    // request access
    const requestAccess = (record: Record) => {
      RecordsService.createRecordAccess({
        record: record.id,
        requested_by: store.getters["user/user"].user,
      }).then(() =>
        store.dispatch("alert/createAlert", {
          heading: "Access Requested",
          type: "success",
          message: "An admin needs to allow you to see this record now.",
        }),
      );
    };

    return {
      // utils
      formatDate,
      // records
      records,
      record,
      // access
      requestAccess,
      ...createRecord(records),
      ...createDeletionRequest(records),
    };
  },
});

function createDeletionRequest(records: Ref<Record[] | null>) {
  const {
    createRequest: createDeletionRequestRequest,
    createModalOpen: createDeletionRequestModalOpen,
  } = useCreateItem(RecordsService.createDeletionRequest, ref(null));

  const deletionRequestCreated = (deletionRequest: RecordDeletion) => {
    if (records.value === null) return;
    const index = records.value.findIndex(
      (item) => item.id === deletionRequest.record,
    );
    if (index !== -1) records.value[index].delete = true;
  };

  return {
    createDeletionRequestRequest,
    createDeletionRequestModalOpen,
    deletionRequestCreated,
  };
}

function createRecord(records: Ref<Record[] | null>) {
  const router = useRouter();

  const createFields = ref<FormField[]>([
    {
      label: "Template",
      type: "select",
      name: "template",
      required: true,
      options: [] as RecordTemplate[],
    },
  ]);

  const { createRequest, createModalOpen } = useCreateItem(
    RecordsService.createRecord,
    records,
  );

  const recordCreated = (record: Record) => {
    router.push({ name: "records-detail", params: { id: record.id } });
  };

  watch(createModalOpen, () => {
    RecordsService.getTemplates().then(
      (templates) => (createFields.value[0].options = templates),
    );
  });

  return {
    createFields,
    createRequest,
    createModalOpen,
    recordCreated,
  };
}
</script>
