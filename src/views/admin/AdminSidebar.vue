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

<script setup lang="ts">
import { TableGenerator } from "@lawandorga/components";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ILink } from "@/types/org";
import LinksCreateLink from "@/actions/LinksCreateLink.vue";
import LinksDeleteLink from "@/actions/LinksDeleteLink.vue";

const client = useClient();

const request = client.get("/api/org/links/");

const links = ref<ILink[]>([]);

const query = useGet(request, links);
</script>
