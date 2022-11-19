<template>
  <template v-if="!!actionsMailUser && !!user">
    <div class="px-6 py-5 bg-white rounded shadow">
      <div
        class="prose prose-th:align-middle prose-h1:text-2xl prose-h2:text-lg"
      >
        <h1 class="">Mail User Role</h1>
        <p>
          E-Mail: {{ user.email || "None yet" }}
          <br />
          <span v-if="user.aliases.length">
            Aliases: {{ user.aliases.join(", ") }}
          </span>
        </p>
        <ButtonNormal
          kind="action"
          @click="actionsMailUser.regeneratePasswordModalOpen = true"
        >
          Regenerate password
        </ButtonNormal>
        <h2 class="">IMAP & SMTP Settings</h2>
        <table>
          <thead>
            <th></th>
            <th>IMAP</th>
            <th>SMTP</th>
          </thead>
          <tbody>
            <tr>
              <th class="!align-middle">Server</th>
              <td>mail.law-orga.de</td>
              <td>mail.law-orga.de</td>
            </tr>
            <tr>
              <th>Port</th>
              <td>143 with STARTTLS</td>
              <td>587 with STARTTLS</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{{ user.email || "None yet" }}</td>
              <td>{{ user.email || "None yet" }}</td>
            </tr>
            <tr>
              <th>Password</th>
              <td>*******</td>
              <td>*******</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-4">
      <TableGenerator
        :head="[
          { name: 'Address', key: 'localpart' },
          { name: 'Domain', key: (o) => o.domain.name },
          { name: 'default', key: 'is_default' },
          { name: '', key: 'action' },
        ]"
        :data="addresses"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="actionsMailUser.addAddressModalOpen = true"
            >
              Add Address
            </ButtonNormal>
          </div>
        </template>
        <template #action="item">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="
                actionsMailUser.temporary = item;
                actionsMailUser.setDefaultAddressModalOpen = true;
              "
            >
              Set as default
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                actionsMailUser.temporary = item;
                actionsMailUser.deleteAddressModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
  </template>
</template>

<script setup lang="ts">
import { actionsMailUserKey } from "@/types/keys";
import {
  MailAddress,
  MailDashboardPage,
  MailUser,
  NoMailAccount,
} from "@/types/mail";
import { ButtonNormal, TableGenerator } from "@lawandorga/components";
import { computed, inject, PropType, toRefs } from "vue";

// page
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
});
const { page } = toRefs(props);

// user
const user = computed<MailUser | null | false>(() => {
  if (page.value == undefined) return null;
  else if (page.value.noMailAccount) return false;
  return page.value.user;
});

// addresses
const addresses = computed<MailAddress[] | null>(() => {
  if (user.value === null || user.value === false) return null;
  return user.value.account.addresses;
});

// actions
const actionsMailUser = inject(actionsMailUserKey);
</script>
