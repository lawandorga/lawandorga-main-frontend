<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import useGet2 from "@/composables/useGet2";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, ref, toRefs } from "vue";

const qualifications = ref<string[]>([]);
useGet2("api/auth/org_users/qualifications/", qualifications);

const userFields = computed<types.FormField[]>((): types.FormField[] => [
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
  {
    label: "Qualifications",
    type: "multiple",
    name: "qualifications",
    required: false,
    options: qualifications.value,
  },
]);

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
  userQualifications: string[];
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
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
      other_user_id: userId,
      qualifications: userQualifications,
      action: 'auth/update_user_data',
    }"
    :request="commandRequest"
  ></ModalUpdate>
</template>
