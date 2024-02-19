<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const userFields: types.FormField[] = [
  {
    name: "data",
    type: "fields",
    fields: [
      {
        label: "Name",
        type: "text",
        name: "name",
        required: true,
      },
      {
        label: "Phone",
        type: "tel",
        name: "phone_number",
        required: false,
      },
      {
        label: "Street",
        type: "text",
        name: "street",
        required: false,
      },
      {
        label: "City",
        type: "text",
        name: "city",
        required: false,
      },
      {
        label: "Postal Code",
        type: "text",
        name: "postal_code",
        required: false,
      },
      {
        label: "Speciality of Study",
        type: "select",
        name: "speciality_of_study",
        options: [
          { value: "", name: "------" },
          { value: "LAW", name: "Law Sciences" },
          { value: "PSYCH", name: "Psychology" },
          { value: "POL", name: "Political Science" },
          { value: "SOC", name: "Social Sciences" },
          { value: "ECO", name: "Economics" },
          { value: "MED", name: "Medicine / Medical Psychology" },
          { value: "PHA", name: "Pharmacy" },
          { value: "CUL", name: "Cultural Studies" },
          { value: "OTHER", name: "Other" },
          { value: "NONE", name: "None" },
        ],
        required: true,
      },
      {
        label: "Note",
        type: "textarea",
        name: "note",
        required: false,
      },
    ],
  },
];

const props = defineProps<{
  query: () => void;
  userId: number;
  userName: string;
  userPhoneNumber: string | null;
  userStreet: string | null;
  userCity: string | null;
  userPostalCode: string | null;
  userSpecialityOfStudy: string | null;
  userNote: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Edit
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    title="Update User"
    :fields="userFields"
    :data="{
      data: {
        name: userName,
        phone_number: userPhoneNumber,
        street: userStreet,
        city: userCity,
        postal_code: userPostalCode,
        speciality_of_study: userSpecialityOfStudy,
        note: userNote,
      },
      other_user_id: userId,
      action: 'auth/update_user_data',
    }"
    :request="commandRequest"
  ></ModalUpdate>
</template>
