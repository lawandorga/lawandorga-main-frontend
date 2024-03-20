<template>
  <ButtonNormal
    kind="action"
    class="w-[150px] text-center"
    :disabled="addressCopied"
    @click="copyMailAddress"
  >
    {{ addressCopied ? "Copied" : "Copy email address" }}
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { ButtonNormal } from "lorga-ui";
import { ref } from "vue";

const address = ref<string>();
const addressCopied = ref<boolean>(false);
const client = useClient();
const request = client.get(
  "api/mail_imports/query/folder_mails/get_cc_address",
);
useGet(request, address);

const copyMailAddress = () => {
  navigator.clipboard.writeText(address.value ?? "");
  addressCopied.value = true;
};
</script>
