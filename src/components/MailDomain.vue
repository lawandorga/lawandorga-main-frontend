<template>
  <template v-if="!!domainActions">
    <div class="px-6 py-5 bg-white rounded shadow">
      <div
        class="prose prose-th:align-middle prose-h1:text-2xl prose-h2:text-lg"
      >
        <h1>Domain Settings</h1>
        <p>
          Domain:
          {{ domainActions.domain ? domainActions.domain.name : "None yet" }}
        </p>
        <ButtonNormal
          v-if="domainActions.domain === null"
          kind="action"
          @click="domainActions.commandModalOpen = true"
        >
          Add a domain
        </ButtonNormal>
        <p v-if="domainActions.domain === null">
          Once you have added a domain you can setup the MX-Records and get
          started adding mail addresses.
        </p>
        <div v-if="domainActions.domain">
          <p>
            You need to setup the correct MX-Records on your domain. In order to
            do that you need to login to your domain hosting provider and setup
            the following records:
          </p>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { actionsDomainKey } from "@/types/keys";
import { ButtonNormal } from "@lawandorga/components";
import { inject } from "vue";

const domainActions = inject(actionsDomainKey);
</script>
