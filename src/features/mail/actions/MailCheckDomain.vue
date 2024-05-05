<template>
  <ButtonNormal kind="action" @click="checkDomainSettings()">
    Check Settings
    <ModalFree v-model="checkModalOpen" title="Check Domain Settings">
      <div v-if="check && check.valid">Your settings are correct.</div>
      <div v-else-if="check && !check.valid" class="text-red-700">
        {{ check.wrong_setting }}
      </div>
      <div v-else-if="!check">Loading...</div>
    </ModalFree>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref, toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  domainUuid: string;
  query: () => void;
}>();

const { query, domainUuid } = toRefs(props);

interface MailCheckDomain {
  valid: boolean;
  wrong_setting: string | null;
}

const check = ref<MailCheckDomain>();

const checkModalOpen = ref(false);

const client = useClient();
const request = client.postAndReturn("api/mail/domains/{uuid}/check_domain/");

const checkDomainSettings = () => {
  check.value = undefined;
  checkModalOpen.value = true;
  request({ uuid: domainUuid.value }).then((d) => {
    query.value();
    check.value = d;
  });
};
</script>
