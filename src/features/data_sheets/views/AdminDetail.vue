<script lang="ts" setup>
import { ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import DeleteField from "@/features/data_sheets/actions/DeleteField.vue";
import { TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import useClient from "@/api/client";
import CreateField from "../actions/CreateField.vue";
import UpdateField from "../actions/UpdateField.vue";

interface Field {
  field_type: string;
  encrypted: string;
  name: string;
  uuid: string;
  order: number;
  kind: string;
  share_keys: boolean | undefined;
  group_id: number | undefined;
  is_required: boolean;
  options?: string[] | number[];
}

interface Template {
  id: number;
  name: string;
  fields: Field[];
}

const route = useRoute();
const client = useClient();

const retrieve = client.get(
  "api/data_sheets/query/templates/{}/",
  route.params.id as string,
);

const template = ref<Template>();
const query = useGet(retrieve, template);
</script>

<template>
  <BoxLoader :show="!!template">
    <div v-if="template" class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Templates', to: { name: 'admin-templates' } },
          {
            name: template.name,
            to: {
              name: 'admin-template',
              params: { id: template.id.toString() },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
        <template #buttons>
          <CreateField :query="query" :template-id="template.id" />
        </template>
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Field', key: 'name' },
          { name: 'Order', key: 'order' },
          { name: 'Kind', key: 'kind' },
          { name: 'Type', key: 'field_type' },
          { name: 'Encrypted', key: 'encrypted' },
          { name: 'Required', key: 'is_required' },
          { name: '', key: 'action' },
        ]"
        :data="template.fields"
      >
        <template #head-encrypted>
          <span class="inline-flex items-center gap-1 group" tabindex="0">
            Encrypted
            <span
              style="anchor-name: --encrypted-btn"
              class="text-gray-400 cursor-help"
            >
              <InformationCircleIcon
                class="w-4 h-4 shrink-0"
                aria-hidden="true"
              />
            </span>
            <div
              role="tooltip"
              style="
                position: fixed;
                position-anchor: --encrypted-btn;
                top: anchor(bottom);
                left: anchor(left);
                margin-top: 4px;
                width: 18rem;
                white-space: normal;
              "
              class="z-50 hidden p-3 space-y-2 text-xs font-normal text-white bg-gray-800 rounded shadow-lg group-hover:block group-focus-within:block"
            >
              <p class="font-semibold">Normal field</p>
              <p>
                Not encrypted. Can be shown and searched in the records table.
                Readable by anyone with record access.
              </p>
              <p class="font-semibold">Encrypted field</p>
              <p>
                Encrypted at the database level. Only users with the correct
                encryption keys can read it. Cannot be shown in the records
                table.
              </p>
            </div>
          </span>
        </template>
        <template #is_required="{ is_required }">
          {{ is_required ? "Yes" : "No" }}
        </template>
        <template #action="{ i: field }">
          <UpdateField
            :query="query"
            :field-name="field.name"
            :field-uuid="field.uuid"
            :field-group="field.group_id"
            :field-options="field.options"
            :field-order="field.order"
            :field-is-required="field.is_required"
            :field-share-keys="field.share_keys"
            :field-type="field.field_type"
            :field-kind="field.kind"
          />
          <DeleteField
            :query="query"
            :field-uuid="field.uuid"
            :field-name="field.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
