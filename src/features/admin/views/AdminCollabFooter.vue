<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import EditCollabFooter from "../actions/EditCollabFooter.vue";
import { useFooter } from "../api/useFooter";
import { useRoute } from "vue-router";
import DinA4Layout from "../components/DinA4Layout.vue";

const route = useRoute();

const { footer, query } = useFooter(route.params.uuid as string);
</script>

<template>
  <div class="flex flex-col max-w-screen-lg min-h-full mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
        { name: 'Preview', to: { name: 'admin-collab-footer' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>

    <!-- Main board -->
    <div v-if="footer" class="flex flex-grow mt-4 space-x-4">
      <div class="flex flex-col w-2/3 bg-white rounded-md shadow">
        <div class="rounded-md bg-gray-50">
          <div class="px-10 py-5">
            <span class="text-xl font-normal">My Footer (Vorschau)</span>
          </div>
        </div>
        <div class="flex-grow px-10 py-5">
          <DinA4Layout>
            <template #footer>
              <div>
                {{ footer.column_1 }}
              </div>
              <div>
                {{ footer.column_2 }}
              </div>
              <div>
                {{ footer.column_3 }}
              </div>
              <div>
                {{ footer.column_4 }}
              </div>
            </template>
          </DinA4Layout>
          <div class="mt-4">
            <EditCollabFooter
              :footer-name="footer.name"
              :footer-description="footer.description"
              :query="query"
              class="mx-2"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar-->
      <div class="w-1/3 bg-white rounded-md shadow h-fit">
        <div class="rounded-md bg-gray-50">
          <div class="px-10 py-5">
            <span class="text-xl font-normal">Beschreibung</span>
          </div>
        </div>
        <div class="px-10 py-5">
          {{ footer.description }}
        </div>
      </div>
    </div>
  </div>
</template>
