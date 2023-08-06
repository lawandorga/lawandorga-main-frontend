<template>
  <div>
    <div class="p-6 mb-10 prose bg-white rounded prose-h1:text-xl">
      <h1>Migrate Data Sheets</h1>
      <p>
        As you might have noticed most of the records (now data sheets) have
        been migrated into folders. The following ones are the only ones left.
      </p>
      <p>
        Only persons with access can migrate those remaining sheets. In order to
        do that they can just click the button that leads to the optimize page.
      </p>
      <p>
        If you have the permission `records__access_all_records` you can see the
        unencrypted attributes of each record.
      </p>
      <p>
        If the record is not needed anymore you can delete the record if you
        have the permission to `records__access_all_records`.
      </p>
    </div>
    <TableGenerator
      :head="[
        { name: 'Token', key: 'token' },
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
          <li
            v-for="(attr, key) in sheet.attributes"
            :key="key"
            class="truncate"
          >
            {{ key }}: {{ attr }}
          </li>
        </ul>
      </template>
      <template #action="sheet">
        <ButtonNormal kind="action" :to="{ name: 'user-optimize' }">
          Go To The Optimize Page To Migrate
        </ButtonNormal>
        <DeleteDataSheet
          :query="query"
          :sheet-name="sheet.name"
          :sheet-uuid="sheet.uuid"
        />
      </template>
    </TableGenerator>
  </div>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { ButtonNormal, TableGenerator } from "lorga-ui";
import { ref } from "vue";
import DeleteDataSheet from "../actions/DeleteDataSheet.vue";

const sheets = ref(null);

const client = useClient();
const request = client.get("/api/records/query/non_migrated/");

const query = useGet(request, sheets);
</script>
