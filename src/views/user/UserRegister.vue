<template>
  <div class="max-w-2xl pb-40 mx-auto mt-12 space-y-6">
    <div class="px-4 pt-4 pb-6 bg-white shadow">
      <h1 class="mb-4 text-2xl font-medium">Register</h1>
      <div v-if="!success" class="">
        <FormGenerator
          :fields="fields"
          :request="commandRequest"
          submit="Register"
          @success="success = true"
        />
      </div>
      <div v-if="success" class="prose">
        <p>
          Your account was created. 2 things need to happen before you can
          login:
        </p>
        <ol>
          <li>An admin from your LC needs to accept you as a member.</li>
          <li>
            You need to confirm your email. We've sent you an email to do that.
          </li>
        </ol>
      </div>
    </div>
    <template v-if="!success">
      <div
        v-for="lr in page?.legal_requirements"
        :key="lr.title"
        class="px-5 py-4 bg-white shadow"
      >
        <Disclosure v-slot="{ open }" :default-open="false">
          <DisclosureButton class="flex items-center justify-between w-full">
            <div class="prose-sm prose max-w-none">
              <h2 class="">
                {{ lr.title }}
              </h2>
            </div>
            <ChevronUpIcon
              :class="open ? 'rotate-180 transform' : ''"
              class="w-5 h-5 text-gray-700"
            />
          </DisclosureButton>
          <DisclosurePanel class="prose-sm prose max-w-none">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="lr.content"></div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { FormGenerator, types } from "lorga-ui";
import { usersGetRegisterPage } from "@/services/user";
import { IRegisterPage } from "@/types/user";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import useGet from "@/composables/useGet";
import { ChevronUpIcon } from "@heroicons/vue/20/solid";
import { getCookie } from "@/utils/cookie";
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";

if (!getCookie("csrftoken")) {
  const redirect = `${window.location.origin}/user/register`;
  const redirectEncoded = encodeURIComponent(redirect);
  const backend = import.meta.env.VITE_AUTH_URL;
  const cookieSetLink = `${backend}/redirect/?next=${redirectEncoded}`;
  window.location.assign(cookieSetLink);
}

const client = useClient();
const request = client.post("api/rlc_users/");
const { commandRequest } = useCommand(request);

const page = ref<IRegisterPage | null>(null);
useGet(usersGetRegisterPage, page);

const fields = computed<types.FormField[]>(() => {
  const fields1: types.FormField[] = [
    {
      label: "RLC",
      name: "org",
      type: "select",
      options: page.value?.orgs as IRegisterPage["orgs"],
      required: true,
    },
    {
      label: "E-Mail",
      name: "email",
      type: "email",
      required: true,
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      required: true,
    },
    {
      label: "Password Confirm",
      name: "password_confirm",
      type: "password",
      required: true,
    },
    {
      label: "Accept Legal Requirements",
      name: "accepted_legal_requirements",
      type: "checkbox",
      required: true,
      options: page.value?.legal_requirements.map((i) => ({
        name: `Accept ${i.title}`,
        value: i.id,
        required: i.accept_required,
      })),
    },
  ];

  return fields1;
});

const success = ref(false);
</script>
