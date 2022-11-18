<template>
  <BoxLoader :show="userStore.loaded && !!actionsMailUser">
    <div
      v-if="userStore.loaded && !!actionsMailUser"
      class="max-w-3xl mx-auto space-y-6"
    >
      <BreadcrumbsBar :base="{ name: 'mail-dashboard' }" :pages="[]">
        <EnvelopeIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <template v-if="actionsMailUser.page != null">
        <template v-if="actionsMailUser.page == false">
          <div class="px-6 py-5 mt-10 bg-white rounded shadow">
            <h1 class="text-lg font-bold text-gray-800">Mail User Role</h1>
            <div class="mt-5">
              <div class="prose">
                <p>
                  You don't have a mail role, yet. Click the button to create
                  one:
                </p>
                <ButtonNormal
                  kind="action"
                  @click="actionsMailUser.createMailUserRole()"
                >
                  Create my mail user role
                </ButtonNormal>
                <p>
                  As soon as you have a mail role you can assign yourself an
                  address and setup your local mail client.
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="px-6 py-5 mt-10 bg-white rounded shadow">
            <div
              class="prose prose-th:align-middle prose-h1:text-2xl prose-h2:text-lg"
            >
              <h1 class="">Mail User Role</h1>
              <p>
                E-Mail: {{ actionsMailUser.user.email || "None yet" }}
                <br />
                <span v-if="actionsMailUser.user.aliases.length">
                  Aliases: {{ actionsMailUser.user.aliases.join(", ") }}
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
                    <td>{{ actionsMailUser.user.email || "None yet" }}</td>
                    <td>{{ actionsMailUser.user.email || "None yet" }}</td>
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

          <TableGenerator
            :head="[
              { name: 'Address', key: 'localpart' },
              { name: 'Domain', key: (o) => o.domain.name },
              { name: 'default', key: 'is_default' },
              { name: '', key: 'action' },
            ]"
            :data="actionsMailUser.addresses"
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
        </template>
      </template>
    </div>
  </BoxLoader>
  <ActionsMailUser ref="actionsMailUser" />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";
import { ButtonNormal, TableGenerator } from "@lawandorga/components";

const userStore = useUserStore();

const actionsMailUser = ref<typeof ActionsMailUser>();
</script>
