<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import useTemplate from "../api/useTemplate";
import EditCollabName from "../actions/EditCollabName.vue";
import EditCollabDescription from "../actions/EditCollabDescription.vue";
import DinA4Layout from "../components/DinA4Layout.vue";
import { ButtonNormal } from "lorga-ui";
import CreateCollabLetterhead from "../actions/CreateCollabLetterhead.vue";
import CreateCollabFooter from "../actions/CreateCollabFooter.vue";
import EditCollabLetterhead from "../actions/EditCollabLetterhead.vue";
import EditCollabFooter from "../actions/EditCollabFooter.vue";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const uuid = computed<string>(() => route.params.uuid as string);

const { template, query } = useTemplate(uuid.value);
</script>

<template>
  <div class="max-w-screen-lg mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
        { name: 'New Template', to: { name: 'admin-collab-edit-template' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <div class="flex gap-7">
      <div class="w-2/3 bg-white rounded-md shadow">
        <div
          class="flex items-center h-16 gap-2 pl-10 text-lg font-semibold bg-gray-50 rounded-t-md text-zinc-700"
        >
          {{ template?.name }} (Preview)
          <EditCollabName :query="query" :uuid="uuid" :name="template?.name" />
        </div>
        <div class="flex gap-8 mt-4 ml-14 mr-11 mb-7">
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
          <XMarkIcon class="w-6 h-6 mr-2" />
          Close
        </ButtonNormal>
      </div>
      <div class="w-1/3 bg-white rounded-md shadow h-fit">
        <div
          class="flex items-center h-16 gap-2 pl-5 text-lg font-semibold bg-gray-50 rounded-t-md text-zinc-700"
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
