<template>
  <BoxLoader show>
    <div class="max-w-2xl px-5 py-4 mx-auto bg-white border rounded shadow">
      <h1 class="text-xl font-medium text-gray-800">Optimization</h1>
      <p class="mt-2">
        Law&Orga is running some checks and trying to fix possible errors.
      </p>
      <ul class="mt-5 space-y-2">
        <li
          v-for="key in Object.keys(status)"
          :key="key"
          class="[&>div]:flex [&>div]:items-center [&>div]:space-x-1 [&>div]:leading-none"
        >
          <div v-if="status[key] == 'waiting'">
            <PauseIcon class="w-5 h-5 text-gray-600" />
            <span class="text-lg font-medium text-gray-800">
              {{ key }} optimization is waiting.
            </span>
          </div>
          <div v-if="status[key] == 'optimizing'">
            <CircleLoader />
            <span class="text-lg font-medium text-gray-800">
              {{ key }} optimization running.
            </span>
          </div>
          <div v-if="status[key] == 'error'">
            <ExclamationTriangleIcon class="w-5 h-5 text-gray-600" />
            <span class="text-lg font-medium text-gray-800">
              {{ key }} optimization encountered an error. We will look into
              this.
            </span>
          </div>
          <div v-if="status[key] == 'success'">
            <CheckIcon class="w-5 h-5 text-gray-600" />
            <span class="text-lg font-medium text-gray-800">
              {{ key }} optimization finished successfully.
            </span>
          </div>
        </li>
      </ul>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { foldersOptimize } from "@/services/folders";
import { recordsOptimize } from "@/services/records";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  PauseIcon,
} from "@heroicons/vue/20/solid";
import { CircleLoader } from "@lawandorga/components";
import { ref, computed } from "vue";

interface IApps {
  [key: string]: () => Promise<void>;
}

const apps: IApps = {
  Records: recordsOptimize,
  Folders: foldersOptimize,
};

const status = ref<{
  [key: keyof IApps]: "optimizing" | "error" | "success" | "waiting";
}>({});

const funcs = computed<{ [key: keyof IApps]: () => Promise<void> }>(() => {
  const d: { [key: keyof IApps]: () => Promise<void> } = {};
  Object.keys(apps).forEach((key) => {
    status.value[key] = "waiting";
    d[key] = () => {
      status.value[key] = "optimizing";
      return apps[key]()
        .then(() => {
          status.value[key] = "success";
        })
        .catch(() => {
          status.value[key] = "error";
        });
    };
  });
  return d;
});

Object.values(funcs.value).reduce(
  (prev, cur) => prev.then(cur),
  Promise.resolve(),
);
</script>
