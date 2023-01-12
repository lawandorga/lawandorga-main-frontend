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
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createModalOpen = true"
            >
              Create Questionnaire
            </ButtonNormal>
          </div>
        </template>
        <template #name="slotProps">
          <ButtonLink
            class="underline"
            :to="{
              name: 'admin-questionnaire',
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="
                questionnaire = slotProps;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                questionnaire = slotProps;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
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
        :data="questionnaire"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :data="questionnaire"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { Questionnaire } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import {
  ModalFree,
  FormGenerator,
  ModalDelete,
  TableGenerator,
  ButtonNormal,
} from "@lawandorga/components";
import RecordsService from "@/services/records";
import useGet from "@/composables/useGet";
import useUpdate from "@/composables/useUpdate";
import useDelete from "@/composables/useDelete";
import useCreate from "@/composables/useCreate";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";

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
    ButtonLink,
    ModalFree,
    FormGenerator,
    BoxLoader,
    CogIcon,
    BreadcrumbsBar,
    TableGenerator,
    ButtonNormal,
  },
  setup() {
    const questionnaires = ref(null) as Ref<Questionnaire[] | null>;
    const questionnaire = ref({}) as Ref<Questionnaire>;

    // get
    useGet(RecordsService.getQuestionnaireTemplates, questionnaires);

    // create
    const { createRequest, createModalOpen } = useCreate(
      RecordsService.createQuestionnaireTemplate,
      questionnaires,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdate(
      RecordsService.updateQuestionnaireTemplate,
      questionnaires,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDelete(
      RecordsService.deleteQuestionnaireTemplate,
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
