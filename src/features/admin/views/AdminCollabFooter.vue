<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import EditCollabFooter from "../actions/EditCollabFooter.vue";
import useCollab from "../../records/api/useCollab";
const { query } = useCollab();
</script>

<template>
  <div class="flex flex-col max-w-screen-lg min-h-full mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>

    <!-- Main board -->
    <div class="flex flex-grow mt-4 space-x-4">
      <div class="flex flex-col w-2/3 bg-white rounded-md shadow">
        <div class="rounded-md bg-gray-50">
          <div class="px-10 py-5">
            <span class="text-xl font-normal">My Footer (Vorschau)</span>
          </div>
        </div>
        <div class="flex-grow px-10 py-5">
          <div class="flex flex-row h-full">
            <div class="flex flex-col w-2/3 h-full">
              <div class="bg-gray-200">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id,
                laborum?
              </div>
              <div class="flex-grow bg-gray-100"><span>test</span></div>
              <div class="bg-gray-200">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem, dolores!
              </div>
            </div>
            <div class="flex flex-col justify-end w-1/3">
              <EditCollabFooter :query="query" class="mx-2" />
            </div>
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
          quam, pariatur nihil consequatur sunt ducimus magni. Deleniti, numquam
          animi fuga laboriosam et non laudantium corporis?
        </div>
      </div>
    </div>
  </div>
</template>
