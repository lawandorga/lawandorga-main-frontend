<script setup lang="ts">
import { CogIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";

import CreateCollabFooter from "../actions/CreateCollabFooter.vue";
import CreateCollabLetterhead from "../actions/CreateCollabLetterhead.vue";
import EditCollabDescription from "../actions/EditCollabDescription.vue";
import EditCollabFooter from "../actions/EditCollabFooter.vue";
import EditCollabLetterhead from "../actions/EditCollabLetterhead.vue";
import EditCollabName from "../actions/EditCollabName.vue";
import useTemplate from "../api/useTemplate";
import DinA4Layout from "../components/DinA4Layout.vue";

const route = useRoute();
const router = useRouter();
const uuid = computed<string>(() => route.params.uuid as string);

const { template, query } = useTemplate(uuid.value);
</script>

<template>
  <div class="mx-auto max-w-(--breakpoint-lg) space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
        {
          name: template?.name ?? 'New Template',
          to: { name: 'admin-collab-edit-template' },
        },
      ]"
    >
      <CogIcon class="h-6 w-6" />
    </BreadcrumbsBar>
    <div class="flex gap-7">
      <div class="w-2/3 rounded-md bg-white shadow">
        <div
          class="flex h-16 items-center gap-2 rounded-t-md bg-gray-50 pl-10 text-lg font-semibold text-zinc-700"
        >
          {{ template?.name }} (Preview)
          <EditCollabName :query="query" :uuid="uuid" :name="template?.name" />
        </div>
        <div class="mt-4 mr-11 mb-7 ml-14 flex gap-8">
          <DinA4Layout class="w-3/5">
            <template v-if="!!template?.letterhead" #header>
              <div class="w-2/5">
                <p>{{ template.letterhead.address_line_1 }}</p>
                <p>{{ template.letterhead.address_line_2 }}</p>
                <p>{{ template.letterhead.address_line_3 }}</p>
                <p>{{ template.letterhead.address_line_4 }}</p>
                <p>{{ template.letterhead.address_line_5 }}</p>
              </div>
              <div class="w-2/5">
                <p class="whitespace-pre-line">
                  <img
                    :src="template.letterhead.logo_base64"
                    alt="Logo"
                    class="ml-auto h-10"
                  />
                  {{ template.letterhead.text_right }}
                </p>
              </div>
            </template>
            <template v-if="!!template?.footer" #footer>
              <p>{{ template.footer.column_1 }}</p>
              <p>{{ template.footer.column_2 }}</p>
              <p>{{ template.footer.column_3 }}</p>
              <p>{{ template.footer.column_4 }}</p>
            </template>
          </DinA4Layout>
          <div class="flex flex-col justify-between">
            <EditCollabLetterhead
              v-if="!!template?.letterhead"
              :query="query"
              class="mt-4"
              :letterhead="template.letterhead"
            />
            <CreateCollabLetterhead
              v-else
              :query="query"
              class="mt-4"
              :uuid="uuid"
            />
            <EditCollabFooter
              v-if="!!template?.footer"
              :query="query"
              :footer="template.footer"
            />
            <CreateCollabFooter v-else :query="query" :uuid="uuid" />
          </div>
        </div>
        <ButtonNormal
          kind="secondary"
          class="mb-4 ml-14"
          @click="router.back()"
        >
          <XMarkIcon class="mr-2 h-6 w-6" />
          Close
        </ButtonNormal>
      </div>
      <div class="h-fit w-1/3 rounded-md bg-white shadow">
        <div
          class="flex h-16 items-center gap-2 rounded-t-md bg-gray-50 pl-5 text-lg font-semibold text-zinc-700"
        >
          Description
          <EditCollabDescription
            :query="query"
            :uuid="uuid"
            :description="template?.description"
          />
        </div>
        <div class="p-5 text-gray-600">
          {{ template?.description }}
        </div>
      </div>
    </div>
  </div>
</template>
