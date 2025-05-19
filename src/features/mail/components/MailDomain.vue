<script lang="ts" setup>
import MailAddDomain from "@/features/mail/actions/AddDomain.vue";
import MailChangeDomain from "@/features/mail/actions/ChangeDomain.vue";
import MailCheckDomain from "@/features/mail/actions/CheckDomain.vue";
import { MailDomain } from "../api/useGetDashboardPage";

defineProps<{
  domain: MailDomain | null;
  query: () => void;
}>();
</script>

<template>
  <div class="px-6 py-5 bg-white rounded shadow">
    <div
      class="prose prose-th:align-middle max-w-none prose-h1:text-2xl prose-h2:text-lg"
    >
      <h1>Domain Settings</h1>
      <p>
        Domain:
        {{ domain ? domain.name : "None yet" }}
      </p>
      <MailAddDomain v-if="domain === null" :query="query" />
      <MailChangeDomain
        v-if="domain"
        :domain-name="domain.name"
        :domain-uuid="domain.uuid"
        :query="query"
      />
      <p v-if="domain === null">
        Once you have added a domain you can setup the MX-Records and get
        started adding mail addresses.
      </p>
      <div v-if="domain">
        <p>
          You need to setup the correct Records on your domain. In order to do
          that you need to login to your domain hosting provider and setup the
          following records:
        </p>
        <table>
          <caption>Required DNS-Record Settings</caption>
          <thead>
            <tr>
              <th>Type</th>
              <th>Hostname</th>
              <th>Destination</th>
              <th>TTL</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MX</td>
              <td>{{ domain.name }}</td>
              <td>mail.law-orga.de</td>
              <td>3600</td>
              <td>10</td>
            </tr>
            <tr>
              <td>TXT (SPF)</td>
              <td>{{ domain.name }}</td>
              <td>v=spf1 include:spf.mail.law-orga.de -all</td>
              <td>3600</td>
              <td>-</td>
            </tr>
            <tr>
              <td>CNAME (DMARC)</td>
              <td>_dmarc.{{ domain.name }}</td>
              <td>dmarc.mail.law-orga.de</td>
              <td>3600</td>
              <td>-</td>
            </tr>
            <tr>
              <td>CNAME (DKIM)</td>
              <td>2022-12.law-orga._domainkey.{{ domain.name }}</td>
              <td>2022-12.dkim.mail.law-orga.de</td>
              <td>3600</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        <p>
          <span
            v-if="domain && !domain.is_active"
            class="text-sm font-medium text-red-700"
          >
            Your domain is not active, please check the settings.
          </span>
          <span v-if="domain && domain.is_active" class="text-sm font-medium">
            Your domain is active.
          </span>
          <br />
          <MailCheckDomain :domain-uuid="domain.uuid" :query="query" />
        </p>
        <p class="mt-12">
          <b>Note:</b>
          You are strongly advised to enable
          <a
            href="https://en.wikipedia.org/wiki/DNSSEC"
            rel="noopener"
            target="_blank"
          >
            <span>DNSSEC</span>
          </a>

          for your domain, or else certain security features break. Note that
          not all domain and DNS providers support DNSSEC. If this is the case
          for your provider(s), you are again strongly advised to change to
          better provider(s).
        </p>
      </div>
    </div>
  </div>
</template>
