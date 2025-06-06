<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  PauseIcon,
} from "@heroicons/vue/20/solid";
import { CircleLoader } from "lorga-ui";
import { useRunOptimizations } from "../api/useRunOptimizations";

const { status, runAll } = useRunOptimizations();

runAll();
</script>

<template>
  <BoxLoader show>
    <div class="max-w-3xl px-5 py-4 mx-auto bg-white border rounded shadow">
      <h1 class="text-xl font-medium text-gray-800">Optimization</h1>
      <div class="mt-2 prose max-w-none">
        <p>
          Law&Orga is running some checks and trying to fix possible errors.
          <br />
          These errors include:
        </p>
        <ul>
          <li>Repairing keys of persons who have missing or invalid keys</li>
          <li>
            Granting record access to persons who have the permission
            <i>records__access_all_records</i>
          </li>
        </ul>
        <p>
          If the optimization encounters an error you do not need to try again.
          The Law&Orga Team will be informed and fix the error as soon as
          possible. The banner will remind you every week to run the
          optimizations.
        </p>
      </div>
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
              {{ key }} optimization encountered an error.
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
