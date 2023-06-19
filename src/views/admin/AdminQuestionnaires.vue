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
        :data="templates"
      >
        <template #head-action>
          <QuestionnaireCreate :query="query" />
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
                template = slotProps;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                template = slotProps;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Questionnaire">
      <FormGenerator
        :fields="fields"
        :data="template"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :data="template"
    />
  </BoxLoader>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
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
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import QuestionnaireCreate from "@/features/questionnaires/actions/QuestionnaireCreate.vue";

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

interface IQuestionnaireTemplate {
  id: string;
  name: string;
  notes: string;
}

const templates = ref(null) as Ref<IQuestionnaireTemplate[] | null>;
const template = ref({}) as Ref<IQuestionnaireTemplate>;

// get
const query = useGet(RecordsService.getQuestionnaireTemplates, templates);

// update
const { updateRequest, updateModalOpen } = useUpdate(
  RecordsService.updateQuestionnaireTemplate,
  templates,
);

// delete
const { deleteRequest, deleteModalOpen } = useDelete(
  RecordsService.deleteQuestionnaireTemplate,
  templates,
);
</script>
