<template>
  <TableGenerator
    :head="[
      { name: 'Name', key: 'name' },
      { name: 'Attrs', key: 'attributes' },
      { name: 'Persons With Access', key: 'persons_with_access' },
      { name: '', key: 'action' },
    ]"
    :data="sheets"
  >
    <template #persons_with_access="sheet">
      <ul class="list-disc list-inside">
        <li v-for="person in sheet.persons_with_access" :key="person.uuid">
          {{ person.name }}
        </li>
      </ul>
    </template>
    <template #attributes="sheet">
      <ul class="max-w-md list-disc list-inside">
        <li v-for="(attr, key) in sheet.attributes" :key="key" class="truncate">
          {{ key }}: {{ attr }}
        </li>
      </ul>
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { TableGenerator } from "@lawandorga/components";
import { ref } from "vue";

const sheets = ref(null);

const client = useClient();
const request = client.get("/api/records/query/non_migrated/");

useGet(request, sheets);
</script>
