<script lang="ts" setup>
import { ref, watch } from "vue";
import { ModalFree } from "lorga-ui";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import RecordsPermissionsTable from "@/features/records/components/RecordsPermissionsTable.vue";

const generalPermissionsModalOpen = ref(false);
const show = ref(false);

watch(generalPermissionsModalOpen, (newValue) => {
  if (newValue === true) show.value = true;
});
</script>

<template>
  <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
    Show General Permissions
  </ButtonBreadcrumbs>
  <ModalFree
    v-model="generalPermissionsModalOpen"
    width="max-w-(--breakpoint-xl)"
    title="General Permission"
  >
    <p class="mb-10 text-gray-600">
      Groups or users listed here have permissions that apply to the whole
      Records section. Those permissions can be managed within the admin
      section.
    </p>
    <RecordsPermissionsTable v-if="show" />
  </ModalFree>
</template>
