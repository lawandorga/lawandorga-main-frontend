<template>
  <template v-if="!!actionsMailUser && !!user">
    <div class="px-6 py-5 bg-white rounded shadow">
      <div
        class="prose prose-th:align-middle prose-h1:text-2xl prose-h2:text-lg max-w-none"
      >
        <h1 class="">Mail User Role</h1>
        <p>
          E-Mail: {{ user.email || "None yet" }}

          <span v-if="user.aliases.length">
            <br />
            Aliases: {{ user.aliases.join(", ") }}
          </span>
          <span v-if="user.groups.length">
            <br />
            Groups: {{ user.groups.map((g) => g.email).join(", ") }}
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
              <td>
                143 with StartTLS
                <br />
                (Outlook 365: Select StartTLS)
                <br />
                (Apple Mail: Set Checkbox Use TLS/SSL)
                <br />
                (Thunderbird: StartTLS)
              </td>
              <td>
                587 with StartTLS
                <br />
                (Outlook 365: Select StartTLS)
                <br />
                (Apple Mail: Set Checkbox Use TLS/SSL)
                <br />
                (Thunderbird: StartTLS)
              </td>
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
        <div v-if="user.groups.length">
          <h2 class="">IMAP & SMTP Settings For Groups</h2>
          <p>
            In order to setup the group account you need to add it as an extra
            account in your favorite mail program.
          </p>
          <p>
            For groups all the settings are the same as above. Port is the same.
            Server is the same. Even the password is the same.
          </p>
          <p>However, the username changes for every group.</p>
          <p class="text-red-700">
            Never share your mail password with anybody. If someone else needs
            access to the group account you can add them on the group page to
            the group and they can use their own password.
          </p>
          <table v-for="(group, index) in user.groups" :key="index">
            <thead>
              <th>Group</th>
              <th>Username</th>
            </thead>
            <tbody>
              <tr>
                <td>{{ group.email }}</td>
                <td>{{ group.email }}*{{ user.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
  IMailAddress,
  MailDashboardPage,
  ISelfMailUser,
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
const user = computed<ISelfMailUser | null | false>(() => {
  if (page.value == undefined) return null;
  else if (page.value.noMailAccount) return false;
  return page.value.user;
});

// addresses
const addresses = computed<IMailAddress[] | null>(() => {
  if (user.value === null || user.value === false) return null;
  return user.value.account.addresses;
});

// actions
const actionsMailUser = inject(actionsMailUserKey);
</script>
