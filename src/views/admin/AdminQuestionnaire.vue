<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="questionnaire"
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'admin-questionnaires' } },
          {
            name: questionnaire.name,
            to: {
              name: 'admin-questionnaire',
              params: { id: questionnaire.id },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Type', key: 'type' },
          { name: 'Order', key: 'order' },
          { name: 'Question', key: 'question' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Add Field
            </ButtonTable>
          </div>
        </template>

        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              type="button"
              @click="
                field = slotProps.dataItem;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonTable>
            <ButtonTable
              type="button"
              @click="
                field = slotProps.dataItem;
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
    <ModalFree v-model="createModalOpen" title="Create Field">
      <FormGenerator
        :fields="formFields"
        :request="createRequest"
        :initial="{ questionnaire: questionnaire.id }"
      />
    </ModalFree>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Field">
      <FormGenerator
        :fields="formFields"
        :initial="field"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="field"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { Questionnaire, QuestionnaireField } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import RecordsService from "@/services/records";
import useGetItem from "@/composables/useGetItem";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";

const formFields = [
  {
    label: "Type",
    name: "type",
    type: "select",
    options: [
      { name: "Text", id: "TEXTAREA" },
      { name: "File", id: "FILE" },
    ],
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
    helptext: "The ordering in which the fields appear.",
  },
  {
    label: "Question",
    name: "question",
    type: "textarea",
    required: true,
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
    // other
    const route = useRoute();

    // items
    const questionnaire = ref(null) as Ref<Questionnaire | null>;
    const fields = ref([]) as Ref<QuestionnaireField[]>;
    const field = ref(null) as Ref<QuestionnaireField | null>;

    // get
    useGetItem(
      RecordsService.getQuestionnaire,
      questionnaire,
      route.params.id as string,
    );

    useGetItems(RecordsService.getQuestionnaireFields, fields, questionnaire);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      RecordsService.createQuestionnaireField,
      fields,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateQuestionnaireField,
      fields,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      RecordsService.deleteQuestionnaireField,
      fields,
    );

    return {
      questionnaire,
      field,
      fields,
      formFields,
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
