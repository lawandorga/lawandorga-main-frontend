<script setup lang="ts">
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import LinksCreateLink from "@/features/admin/actions/CreateLink.vue";
import LinksDeleteLink from "@/features/admin/actions/DeleteLink.vue";

import { useLinks } from "../api/useLinks";

const { links, query } = useLinks();
</script>

<template>
  <BoxLoader show>
    <div class="mx-auto max-w-2xl space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Sidebar', to: { name: 'admin-sidebar' } }]"
      >
        <CogIcon class="h-6 w-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'Link', key: 'link' },
          { name: '', key: 'action' },
        ]"
        :data="links"
      >
        <template #head-action>
          <LinksCreateLink :query="query" />
        </template>
        <template #action="slotProps">
          <LinksDeleteLink
            :link-id="slotProps.id"
            :name="slotProps.name"
            :query="query"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
