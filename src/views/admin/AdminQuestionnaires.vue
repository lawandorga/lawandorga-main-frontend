<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'admin-questionnaires' } },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="questionnaires"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Create Questionnaire
            </ButtonTable>
          </div>
        </template>
        <template #name="slotProps">
          <router-link
            class="underline"
            :to="{
              name: 'admin-questionnaire',
              params: { id: slotProps.dataItem.id },
            }"
          >
            {{ slotProps.dataItem.name }}
          </router-link>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              type="button"
              @click="
                questionnaire = slotProps.dataItem;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonTable>
            <ButtonTable
              type="button"
              @click="
                questionnaire = slotProps.dataItem;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonTable>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- create -->
    <ModalFree v-model="createModalOpen" title="Create Questionnaire">
      <FormGenerator :fields="fields" :request="createRequest" />
    </ModalFree>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Questionnaire">
      <FormGenerator
        :fields="fields"
        :initial="questionnaire"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="questionnaire"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { Questionnaire } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import RecordsService from "@/services/records";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";

const fields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Note",
    name: "notes",
    type: "textarea",
    required: false,
  },
];

export default defineComponent({
  components: {
    ModalDelete,
    ModalFree,
    FormGenerator,
    BoxLoader,
    CogIcon,
    BreadcrumbsBar,
    TableGenerator,
    ButtonTable,
  },
  setup() {
    const questionnaires = ref([]) as Ref<Questionnaire[]>;
    const questionnaire = ref({}) as Ref<Questionnaire>;

    // get
    useGetItems(RecordsService.getQuestionnaires, questionnaires);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      RecordsService.createQuestionnaire,
      questionnaires,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateQuestionnaire,
      questionnaires,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      RecordsService.deleteQuestionnaire,
      questionnaires,
    );

    return {
      questionnaires,
      questionnaire,
      fields,
      // create
      createRequest,
      createModalOpen,
      // update
      updateRequest,
      updateModalOpen,
      // delete
      deleteRequest,
      deleteModalOpen,
    };
  },
});
</script>

<style></style>
