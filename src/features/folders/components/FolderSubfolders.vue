<script lang="ts" setup>
import { TableGenerator } from "lorga-ui";

import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import ButtonLink from "@/components/ButtonLink.vue";

import { Subfolder } from "../api/useFolder";
import { ContentItemId, ContentItemType } from "../types";

defineProps<{
  selectedType: ContentItemType;
  folders: Subfolder[];
  selectedId: ContentItemId;
}>();
</script>

<template>
  <BoxHeadingStats
    title="Subfolders"
    :show="selectedId === 'SUBFOLDER'"
    :stats="['This folder has the following subfolders']"
    nopadding
  >
    <TableGenerator :head="[{ name: 'Folder', key: 'name' }]" :data="folders">
      <template #name="{ i }">
        <ButtonLink
          :to="{
            name: 'folders-detail',
            params: { uuid: i.uuid },
          }"
        >
          {{ i.name }}
        </ButtonLink>
      </template>
    </TableGenerator>
  </BoxHeadingStats>
</template>
