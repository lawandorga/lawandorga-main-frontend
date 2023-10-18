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
          <ButtonBreadcrumbs @click="helpModalOpen = true">
            Show Help
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Field', key: 'name' },
          { name: 'Order', key: 'order' },
          { name: 'Kind', key: 'kind' },
          { name: 'Type', key: 'type' },
          { name: 'Encrypted', key: 'encrypted' },
          { name: '', key: 'action' },
        ]"
        :data="template.fields"
      >
        <template #head-action>
          <CreateField :query="query" :template-id="template.id" />
        </template>
        <template #action="{ i }">
          <UpdateField
            :query="query"
            :field-name="i.name"
            :field-uuid="i.uuid"
            :field-group="i.group_id"
            :field-options="i.options"
            :field-order="i.order"
            :field-share-keys="i.share_keys"
            :field-type="i.type"
            :field-kind="i.kind"
          />
          <DeleteField
            :query="query"
            :field-uuid="i.uuid"
            :field-name="i.name"
          />
        </template>
      </TableGenerator>
    </div>
    <!-- help -->
    <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
      <article class="prose">
        <p>
          Here is a short explanation of the difference between encrypted and
          normal fieds.
        </p>
        <h3 class="text-base">Normal fields</h3>
        <p>
          Normal fields are not encrypted at all, which means that everybody who
          can access the database can read the information in those fields.
          Access to the database is limited to two Law&amp;Orga employees.
        </p>
        <p>
          Users who do not have access to the record can not read its normal
          fields. That means only users who have access to the record can also
          access its normal fields.
        </p>
        <p>
          Normal fields can be shown in the records table. That means that the
          records may be filtered or searched by that field.
        </p>
        <p>
          You should use normal fields for less sensitive information which you
          want to show within the records table.
        </p>
        <h3 class="text-base">Encrypted fields</h3>
        <p>
          Encrypted fields are encrypted at the database level which means that
          only users whith the proper encryption keys can decrypt the data
          within those fields. Nobody from Law&amp;Orga has access to the
          content in those fields.
        </p>
        <p>
          Users need to have the encryption keys of the record to decrypt and
          read encrypted fields.
        </p>
        <p>
          Encrypted fields can not be shown in the records table, because it
          would take too long to decrypt those fields on every record.
          Furthermore not every user within the LC might have encryption keys
          for every record.
        </p>
        <p>You should use encrypted fields for sensitive information.</p>
      </article>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { RecordTemplate } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import DeleteField from "@/features/data_sheets/actions/DeleteField.vue";
import { ModalFree, TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import useClient from "@/api/client";
import CreateField from "../actions/CreateField.vue";
import UpdateField from "../actions/UpdateField.vue";

interface IField {
  field_type: string;
  encrypted: string;
  name: string;
  uuid: string;
  order: number;
  kind: string;
  share_keys: boolean | null;
  group_id: number | null;
}

interface ITemplate {
  id: number;
  name: string;
  fields: IField[];
}

// other
const route = useRoute();
const client = useClient();

// template
const retrieve = client.get(
  "api/records/query/templates/{}/",
  route.params.id as string,
);

const template = ref<ITemplate>();
const query = useGet(retrieve, template);

// help
const helpModalOpen = ref(false);
</script>
