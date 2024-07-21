<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import useTemplate from "../api/useTemplate";
import EditCollabName from "../actions/EditCollabName.vue";
import EditCollabDescription from "../actions/EditCollabDescription.vue";

const route = useRoute();
const { uuid } = route.params;
if (Array.isArray(uuid)) {
  throw Error("Unexpected amount of uuids");
}
const { template, query } = useTemplate(uuid);
</script>

<template>
  <div class="max-w-screen-lg mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
        { name: 'New Template', to: { name: 'admin-collab-edit-template' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <div class="flex gap-7">
      <div class="w-2/3 bg-white rounded-md shadow">
        <div
          class="flex items-center h-16 gap-2 pl-10 text-lg font-semibold bg-gray-50 rounded-t-md text-zinc-700"
        >
          {{ template?.name }} (Preview)
          <EditCollabName :query="query" :uuid="uuid" :name="template?.name" />
        </div>
        <!-- DinA4 thing -->
        <!-- Add letterhead -->
        <!-- Add footer -->
        <!-- Close button -->
      </div>
      <div class="w-1/3 bg-white rounded-md shadow">
        <div
          class="flex items-center h-16 gap-2 pl-5 text-lg font-semibold bg-gray-50 rounded-t-md text-zinc-700"
        >
          Description
          <EditCollabDescription
            :query="query"
            :uuid="uuid"
            :description="template?.description"
          />
        </div>
        <div class="p-5 text-gray-600">
          {{ template?.description }}
        </div>
      </div>
    </div>
  </div>
</template>
