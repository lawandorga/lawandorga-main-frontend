<script setup lang="ts">
import { TableGenerator } from "lorga-ui";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import LinksCreateLink from "@/features/admin/actions/CreateLink.vue";
import LinksDeleteLink from "@/features/admin/actions/DeleteLink.vue";
import { useLinks } from "../api/useLinks";

const { links, query } = useLinks();
</script>

<template>
  <BoxLoader show>
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Sidebar', to: { name: 'admin-sidebar' } }]"
      >
        <CogIcon class="w-6 h-6" />
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
