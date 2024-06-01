<template>
  <BoxHeadingStats
    title="Subfolders"
    :show="selectedId === 'SUBFOLDER'"
    :stats="['This folder has the following subfolders']"
    nopadding
  >
    <TableGenerator
      :head="[
        { name: 'Folder', key: 'name' },
        { name: '', key: 'action' },
      ]"
      :data="folders"
    >
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

<script lang="ts" setup>
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { TableGenerator } from "lorga-ui";
import ButtonLink from "@/components/ButtonLink.vue";
import { Subfolder } from "../api/useFolder";

defineProps<{
  selectedType: string;
  folders: Subfolder[];
  selectedId: string | null | number;
}>();
</script>
