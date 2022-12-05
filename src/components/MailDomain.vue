<template>
  <template v-if="!!domainActions">
    <div class="px-6 py-5 bg-white rounded shadow">
      <div
        class="prose prose-th:align-middle prose-h1:text-2xl prose-h2:text-lg"
      >
        <h1>Domain Settings</h1>
        <p>
          Domain:
          {{ domain ? domain.name : "None yet" }}
        </p>
        <ButtonNormal
          v-if="domain === null"
          kind="action"
          @click="domainActions.commandModalOpen = true"
        >
          Add a domain
        </ButtonNormal>
        <ButtonNormal
          v-if="domain"
          kind="action"
          @click="
            domainActions.temporary = domain;
            domainActions.changeDomainModalOpen = true;
          "
        >
          Change the domain
        </ButtonNormal>
        <p v-if="domain === null">
          Once you have added a domain you can setup the MX-Records and get
          started adding mail addresses.
        </p>
        <div v-if="domain">
          <p>
            You need to setup the correct MX-Records on your domain. In order to
            do that you need to login to your domain hosting provider and setup
            the following records:
          </p>
          <table>
            <thead>
              <tr>
                <th>Hostname</th>
                <th>Destination</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>@</td>
                <td>mail.law-orga.de</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
          <p>
            Status:
            <span v-if="check && check.valid">
              Your MX-Records Settings are correct.
            </span>
            <span v-if="check && !check.valid" class="font-medium text-red-700">
              Your MX-Records Settings are not correct. They contain the
              following domains: {{ check.mx_records }}
            </span>
            <span v-if="!check">Loading...</span>
          </p>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import useGet from "@/composables/useGet";
import { mailCheckDomain } from "@/services/mail";
import { actionsDomainKey } from "@/types/keys";
import {
  IMailCheckDomain,
  IMailDomain,
  MailDashboardPage,
  NoMailAccount,
} from "@/types/mail";
import { ButtonNormal } from "@lawandorga/components";
import { computed, inject, PropType, toRefs, ref } from "vue";

// page
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
});
const { page } = toRefs(props);

// check
const check = ref<IMailCheckDomain>();
useGet(mailCheckDomain, check);

// domain
const domain = computed<IMailDomain | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.domain;
  return null;
});

// actions
const domainActions = inject(actionsDomainKey);
</script>
