<script lang="ts" setup>
import { CircleLoader } from "lorga-ui";
import { ref } from "vue";
import { useRoute } from "vue-router";

import useClient from "@/api/client";
import { getRawLoginUrl } from "@/utils/login";

const success = ref(false);
const loading = ref(true);
const route = useRoute();
const client = useClient();

const request = client.post(
  "api/auth/org_users/{}/confirm_email/{}/",
  route.params.user as string,
  route.params.token as string,
);

request()
  .then(() => (success.value = true))
  .catch(() => (success.value = false))
  .finally(() => (loading.value = false));
</script>

<template>
  <div class="mx-auto mt-12 max-w-2xl bg-white px-4 pt-4 pb-6 shadow">
    <h2 class="mb-4 text-2xl font-medium">E-Mail Confirmation</h2>
    <div v-if="loading" class="text-lg">
      <p>One Moment please, we are checking the confirmation link.</p>
      <CircleLoader />
    </div>
    <div v-if="success" class="text-lg">
      E-Mail confirmation successful. You can login now.
      <br />
      <br />
      <a :href="getRawLoginUrl()" class="underline">> Login</a>
    </div>
    <div v-else class="text-lg">
      Something went wrong. Maybe your email is already confirmed. Please try to
      login. If that doesn't work, please contact us on
      <a href="mailto:it@law-orga.de" class="underline">it@law-orga.de</a>
      <span>.</span>
      <br />
      <br />
      <a :href="getRawLoginUrl()" class="underline">> Login</a>
    </div>
  </div>
</template>
