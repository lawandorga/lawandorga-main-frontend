<template>
  <div class="mx-auto space-y-6 max-w-screen-2xl">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'help-dashboard' }"
      :pages="[{ name: 'Permissions', to: { name: 'help-permissions' } }]"
    >
      <LifebuoyIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <TableGenerator
      :head="[
        { name: 'Permission', key: 'name' },
        { name: 'Explanation', key: 'description' },
        { name: 'Useful Group', key: 'recommended_for' },
      ]"
      :data="permissions"
    >
      <template #description="slotProps">
        <div class="max-w-lg break-words whitespace-pre-line">
          {{ slotProps.description }}
        </div>
      </template>
    </TableGenerator>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { LifebuoyIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

const client = useClient();
const request = client.get("/api/permissions/query/permissions/");
const permissions = ref();
useGet(request, permissions);
</script>
