<template>
  <BoxLoader :show="!!$store.getters['user/user'] && !!data">
    <div class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <ViewGridIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <h1 class="text-4xl font-bold text-gray-700">
        Welcome {{ $store.getters["user/user"].name }}
      </h1>
      <div class="grid grid-cols-3 gap-6">
        <div>
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            Active Records
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li v-for="record in data.records" :key="record" class="block">
              <router-link
                :to="{ name: 'records-detail', params: { id: record.id } }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }} ({{ record.state }})
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.members">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            New Members
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li v-for="member in data.members" :key="member.id" class="block">
              <router-link
                :to="{
                  name: 'admin-profile',
                  params: { id: member.rlcuserid },
                }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ member.name }}
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="hidden">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            Outstanding Questionnaires
          </h2>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { defineComponent, ref } from "vue";
import UsersService from "@/services/user";
import { ViewGridIcon, ChevronRightIcon } from "@heroicons/vue/outline";
import { DashboardInformation } from "@/types/user";

export default defineComponent({
  components: {
    ChevronRightIcon,
    ViewGridIcon,
    BreadcrumbsBar,
    BoxLoader,
  },
  setup() {
    const data = ref<DashboardInformation | null>(null);

    UsersService.dashboard().then((dashboard) => (data.value = dashboard));

    return {
      data,
    };
  },
});
</script>
