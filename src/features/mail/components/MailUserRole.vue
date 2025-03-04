<template>
  <template v-if="!!user">
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
        <MailRegeneratePassword />
        <h2 id="table-describe" class="">IMAP & SMTP Settings</h2>
        <table aria-describedby="table-describe">
          <thead>
            <tr>
              <th></th>
              <th scope="col">IMAP</th>
              <th scope="col">SMTP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="!align-middle">Server</th>
              <td>mail.law-orga.de</td>
              <td>mail.law-orga.de</td>
            </tr>
            <tr>
              <th scope="row">Port</th>
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
              <th scope="row">Username</th>
              <td>{{ user.email || "None yet" }}</td>
              <td>{{ user.email || "None yet" }}</td>
            </tr>
            <tr>
              <th scope="row">Password</th>
              <td>*******</td>
              <td>*******</td>
            </tr>
          </tbody>
        </table>
        <div v-if="user.groups.length">
          <h2 id="table-describe-groups" class="">
            IMAP & SMTP Settings For Groups
          </h2>
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
          <table
            v-for="(group, index) in user.groups"
            :key="index"
            aria-describedby="table-describe-groups"
          >
            <thead>
              <tr>
                <th>Group</th>
                <th>Username</th>
              </tr>
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
          <MailAddAddress
            :query="query"
            :user-uuid="user.uuid"
            :available-domains="
              page.noMailAccount ? [] : page.available_domains
            "
          />
        </template>
        <template #action="item">
          <MailSetDefaultAddress
            v-show="!item.is_default"
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="user.uuid"
          />
          <MailDeleteAddress
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="user.uuid"
          />
        </template>
      </TableGenerator>
    </div>
  </template>
</template>

<script setup lang="ts">
import MailAddAddress from "@/features/mail/actions/MailAddAddress.vue";
import MailDeleteAddress from "@/features/mail/actions/MailDeleteAddress.vue";
import MailRegeneratePassword from "@/features/mail/actions/MailRegeneratePassword.vue";
import MailSetDefaultAddress from "@/features/mail/actions/MailSetDefaultAddress.vue";
import { TableGenerator } from "lorga-ui";
import { toRefs } from "vue";
import {
  MailAddress,
  MailDashboardPage,
  NoMailAccount,
  SelfMailUser,
} from "../api/useGetDashboardPage";

const props = defineProps<{
  page: MailDashboardPage | NoMailAccount;
  user: SelfMailUser | null | false;
  addresses: MailAddress[] | null;
  query: () => void;
}>();
const { page } = toRefs(props);
</script>
