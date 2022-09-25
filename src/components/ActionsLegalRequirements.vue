<template>
  <div></div>
</template>

<script setup lang="ts">
import { legalRequirementsKey } from "@/types/keys";
import { inject, ref } from "vue";
import useGet from "@/composables/useGet";
import LegalService from "@/services/legal";
import { LegalRequirement } from "@/types/legal";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const legalRequirements = inject(legalRequirementsKey, ref(null));

useGet(LegalService.getLegalRequirements, legalRequirements);

const accept = (lr: LegalRequirement) => {
  return LegalService.acceptLegalRequirement(lr).then((newItem) => {
    userStore.updateData();
    const index = legalRequirements.value?.findIndex(
      (i) => i.id === newItem.id,
    );

    if (index !== undefined && index !== -1)
      legalRequirements.value?.splice(index, 1, newItem);
  });
};

defineExpose({
  accept,
});
</script>
