<template>
  <div v-if="link" class="max-w-2xl px-6 py-5 mx-auto bg-white shadow">
    <h2 class="mb-3 text-2xl font-bold">Upload: {{ link.name }}</h2>

    <div v-if="link.disabled" class="mt-10">
      <p>The link is disabled. No more files can be uploaded.</p>
    </div>
    <div v-if="!link.disabled" class="mt-10">
      <FormGenerator
        v-if="!success"
        button="Save"
        :fields="fields"
        :request="request"
        @success="success = true"
        @change="formChanged($event)"
      />
      <p v-else>
        File successfully uploaded.
        <br />
        <ButtonNormal kind="action" @click="success = false">
          Upload another one
        </ButtonNormal>
      </p>
    </div>
  </div>
  <div v-else>
    <CircleLoader />
  </div>
</template>

<script lang="ts" setup>
import {
  ButtonNormal,
  CircleLoader,
  FormGenerator,
  types,
} from "@lawandorga/components";
import { useRoute } from "vue-router";
import useClient from "@/api/client";
import { ref } from "vue";
import { IUploadLink } from "@/types/uploads";
import useGet from "@/composables/useGet";

const route = useRoute();
if (!("cookie" in route.query)) {
  const cookieSetLink = `${import.meta.env.VITE_AUTH_URL}/redirect/?next=${
    window.location.origin
  }${window.location.pathname}%3Fcookie`;
  window.location.assign(cookieSetLink);
}

const success = ref(false);

const fields: types.FormField[] = [
  { label: "Filename", name: "name", type: "text", required: true },
  { label: "File", name: "file", type: "file", required: true },
];

const client = useClient();

const link = ref<IUploadLink>();
useGet(
  client.get("api/uploads/query/{}/public/", route.params.uuid as string),
  link,
);

const request = client.postAsFormData(
  "api/uploads/links/{}/upload/",
  route.params.uuid as string,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formChanged = (data: Record<string, any>) => {
  if ("file" in data && !("name" in data)) data["name"] = data.file.name;
};
</script>
