<template>
  <BoxLoader show>
    <div class="max-w-2xl px-5 py-4 mx-auto bg-white border rounded shadow">
      <h1 class="text-xl font-medium text-gray-800">Optimization</h1>
      <p class="mt-2">
        Law&Orga is running some checks and trying to fix possible errors.
      </p>
      <ul class="mt-5 space-y-2">
        <li
          v-if="recordsStatus"
          class="[&>div]:flex [&>div]:items-center [&>div]:space-x-1 [&>div]:leading-none"
        >
          <div v-if="recordsStatus == 'optimizing'">
            <CircleLoader />
            <span class="text-lg font-medium text-gray-800">
              Records are being optimized.
            </span>
          </div>
          <div v-if="recordsStatus == 'error'">
            <ExclamationTriangleIcon class="w-5 h-5 text-gray-600" />
            <span class="text-lg font-medium text-gray-800">
              Records Optimization encounterd an error. We will look into this.
            </span>
          </div>
          <div v-if="recordsStatus == 'success'">
            <CheckIcon class="w-5 h-5 text-gray-600" />
            <span class="text-lg font-medium text-gray-800">
              Records Optimization finished successfully.
            </span>
          </div>
        </li>
      </ul>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { recordsOptimize } from "@/services/records";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import { CircleLoader } from "@lawandorga/components";
import { ref } from "vue";

const recordsStatus = ref<"optimizing" | "error" | "success">();

const optimize = () => {
  recordsStatus.value = "optimizing";
  recordsOptimize()
    .then(() => (recordsStatus.value = "success"))
    .catch(() => (recordsStatus.value = "error"));
};

optimize();
</script>
