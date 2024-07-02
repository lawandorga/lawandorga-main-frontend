<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import EditCollabLetterhead from "../actions/EditCollabLetterhead.vue";
import { useLetterhead } from "../api/useLetterhead";
import { useRoute } from "vue-router";
import DinA4Layout from "../components/DinA4Layout.vue";

const route = useRoute();

const { letterhead, query } = useLetterhead(route.params.uuid as string);
</script>

<template>
  <div class="flex flex-col max-w-screen-lg min-h-full mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
        { name: 'Letterhead', to: { name: 'admin-collab-letterhead' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>

    <!-- Main board -->
    <div v-if="letterhead" class="flex flex-grow mt-4 space-x-4">
      <div class="flex flex-col w-2/3 bg-white rounded-md shadow">
        <div class="rounded-md bg-gray-50">
          <div class="px-10 py-5">
            <span class="text-xl font-normal">
              {{ letterhead.name }} (Vorschau)
            </span>
          </div>
        </div>
        <div class="flex-grow px-10 py-5">
          <div class="mt-4">
            <EditCollabLetterhead
              :letterhead="letterhead"
              :query="query"
              class="mx-2"
            />
            <DinA4Layout>
              <template #header>
                <div class="flex justify-between">
                  <div class="w-1/3 text-justify">
                    <p>{{ letterhead.address_line_1 }}</p>
                    <p>{{ letterhead.address_line_2 }}</p>
                    <p>{{ letterhead.address_line_3 }}</p>
                    <p>{{ letterhead.address_line_4 }}</p>
                  </div>
                  <div class="w-1/3 text-justify">
                    {{ letterhead.text_right }}
                  </div>
                </div>
              </template>
            </DinA4Layout>
          </div>
        </div>

        <!-- Sidebar-->
      </div>
      <div class="w-1/3 bg-white rounded-md shadow h-fit">
        <div class="rounded-md bg-gray-50">
          <div class="px-10 py-5">
            <span class="text-xl font-normal">Beschreibung</span>
          </div>
        </div>
        <div class="px-10 py-5">
          {{ letterhead.description }}
        </div>
      </div>
    </div>
  </div>
</template>
