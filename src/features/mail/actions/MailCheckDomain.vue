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
import { mailCheckDomain } from "@/features/mail/mail";
import { MailCheckDomain } from "@/types/mail";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref, toRefs } from "vue";

const props = defineProps<{
  domainUuid: string;
  query: () => void;
}>();

const { query, domainUuid } = toRefs(props);

const check = ref<MailCheckDomain>();

const checkModalOpen = ref(false);

const checkDomainSettings = () => {
  check.value = undefined;
  checkModalOpen.value = true;
  mailCheckDomain({ uuid: domainUuid.value }).then((d) => {
    query.value();
    check.value = d;
  });
};
</script>
