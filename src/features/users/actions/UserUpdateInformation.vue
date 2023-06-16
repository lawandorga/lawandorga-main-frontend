<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const userFields: types.FormField[] = [
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
];

const props = defineProps<{
  query: () => void;
  userId: number;
  userName: string;
  userPhoneNumber: string;
  userStreet: string;
  userCity: string;
  userPostalCode: string;
  userSpecialityOfStudy: string | null;
  userNote: string;
}>();
const { query, userId } = toRefs(props);

const client = useClient();
const updateRequest = client.put(
  "/api/rlc_users/{}/update_information/",
  userId,
);

const { commandRequest, commandModalOpen } = useCommand(
  updateRequest,
  query.value,
);
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
      name: userName,
      phone_number: userPhoneNumber,
      street: userStreet,
      city: userCity,
      postal_code: userPostalCode,
      speciality_of_study: userSpecialityOfStudy,
      note: userNote,
    }"
    :request="commandRequest"
  ></ModalUpdate>
</template>
