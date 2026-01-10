<script lang="ts" setup>
import { ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { LifebuoyIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import useGet2 from "@/composables/useGet2";

const permissions = ref();

useGet2("/api/permissions/query/permissions/", permissions);
</script>

<template>
  <div class="mx-auto space-y-6 max-w-(--breakpoint-2xl)">
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
        <div class="max-w-lg whitespace-pre-line wrap-break-word">
          {{ slotProps.description }}
        </div>
      </template>
    </TableGenerator>
  </div>
</template>
