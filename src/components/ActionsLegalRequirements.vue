<template>
  <div></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useGet from "@/composables/useGet";
import LegalService from "@/services/legal";
import { useUserStore } from "@/store/user";
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";
import { LegalRequirement } from "@/types/legal";

const userStore = useUserStore();
const legalRequirements = ref<LegalRequirement[] | null>(null);

useGet(LegalService.getLegalRequirements, legalRequirements);

const { commandRequest: accept } = useCommand(
  LegalService.acceptLegalRequirement,
  useQuery(LegalService.getLegalRequirements, legalRequirements),
  () => userStore.updateData(),
);

defineExpose({
  legalRequirements,
  accept,
});
</script>
