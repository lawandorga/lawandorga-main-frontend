<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import { useMembers } from "../api/useMembers";

const { members } = useMembers();
</script>

<template>
  <div v-if="members?.length">
    <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
      New Members in no groups
    </h2>
    <ul class="mt-2 space-y-1 rounded bg-white p-1 shadow">
      <li v-for="member in members" :key="member.id" class="block">
        <router-link
          :to="{
            name: 'admin-profile',
            params: { id: member.rlcuserid },
          }"
          class="group relative block w-full rounded-sm px-4 py-2 text-left text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
        >
          {{ member.name }}
          <div
            class="absolute top-0 right-0 bottom-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
          >
            <ChevronRightIcon class="mr-1.5 h-6 w-6 text-gray-300" />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
